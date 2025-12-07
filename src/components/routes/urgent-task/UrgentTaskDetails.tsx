/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
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
    SelectYourService: { title: "Select Your Service" },
    handyMan: { title: "Handyman & Home Repairs" },
    PetServices: { title: "Pet Services" },
    CompleteCleaning: { title: "Cleaning Services" },
    automotiveServices: { title: "Plumbing, Electrical & HVAC (PEH)" },
    rideServices: { title: "Automotive Services" },
    beautyWellness: { title: "All Other Specialized Services" },
} as const;

type ServiceKey = keyof typeof servicesData;

const UrgentTaskDetails = ({ onBack, onContinue }: Props) => {
    const dispatch = useDispatch();
    const taskForm = useSelector((state: RootState) => state.taskForm);
    const [selectedService, setSelectedService] = useState<ServiceKey>(
        (taskForm.serviceId as ServiceKey) || "automotiveServices"
    );
    const [images, setImages] = useState<File[]>(taskForm.photos || []);
    const [customLocation, setCustomLocation] = useState(taskForm.location || "");
    const [locationType, setLocationType] = useState<"In-Person" | "Remote">(
        taskForm.location === "Remote" ? "Remote" : "In-Person"
    );
    const searchParams = useSearchParams();
    const searchQuery = searchParams ? searchParams.get("search") || "" : "";

    const isGeneralService = searchQuery?.toLowerCase() === "general service";

    // Initialize as empty for general service
    const [taskInput, setTaskInput] = useState(isGeneralService ? "" : searchQuery);
    const [inputValue, setInputValue] = useState(isGeneralService ? "" : searchQuery);

    // Sync search query → task title
    useEffect(() => {
        if (isGeneralService) {
            setTaskInput("");
            setInputValue("");
            dispatch(updateTaskField({ field: "taskTitle", value: "" }));
        } else if (searchQuery) {
            setTaskInput(searchQuery);
            dispatch(updateTaskField({ field: "taskTitle", value: searchQuery }));
        }
    }, [searchQuery, isGeneralService, dispatch]);

    // For "general service" allow manual title input
    useEffect(() => {
        if (isGeneralService) {
            dispatch(updateTaskField({ field: "taskTitle", value: inputValue.trim() }));
        }
    }, [inputValue, isGeneralService, dispatch]);

    // Sync location type and custom address
    useEffect(() => {
        const location = taskForm.location || "";
        if (location === "Remote") {
            setLocationType("Remote");
            setCustomLocation("");
        } else {
            setLocationType("In-Person");
            setCustomLocation(location);
        }
    }, [taskForm.location]);

    useEffect(() => {
        if (locationType === "Remote") {
            setCustomLocation("");
            dispatch(updateTaskField({ field: "location", value: "Remote" }));
        } else {
            const trimmed = customLocation.trim();
            dispatch(updateTaskField({ field: "location", value: trimmed || "" }));
        }
    }, [locationType, customLocation, dispatch]);

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

    // Validation Logic
    const isFormValid = useMemo(() => {
        const hasTitle = taskForm.taskTitle?.trim().length > 0;

        const hasValidLocation =
            locationType === "Remote" ||
            (locationType === "In-Person" && customLocation.trim().length > 0);

        const hasDescription = taskForm.taskDescription?.trim().length > 0;

        const hasService = selectedService && selectedService !== "SelectYourService";

        return hasTitle && hasValidLocation && hasDescription && hasService;
    }, [taskForm.taskTitle, taskForm.taskDescription, locationType, customLocation, selectedService]);

    const handleContinue = () => {
        if (isFormValid) {
            onContinue();
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#063A41] text-white py-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Tell us what you need</h1>
                    <p className="text-[#E5FFDB] text-sm">Step 1 of 3</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Task Title */}
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-3 text-lg">
                        What do you need help with? <span className="text-red-500">*</span>
                    </label>
                    {isGeneralService ? (
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="e.g., Fix leaking faucet, Clean apartment"
                            className="w-full border-2 border-gray-200 rounded-lg p-4 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors"
                        />
                    ) : (
                        <div className="bg-[#E5FFDB] rounded-lg p-4">
                            <p className="text-[#063A41] text-xl font-semibold capitalize">{searchQuery || "—"}</p>
                        </div>
                    )}
                </div>

                {/* Location */}
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-3 text-lg">
                        Where do you need it done? <span className="text-red-500">*</span>
                    </label>

                    <div className="flex gap-3 mb-4">
                        <button
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${locationType === "In-Person"
                                ? "bg-[#109C3D] text-white shadow-md"
                                : "bg-gray-100 text-[#063A41] hover:bg-gray-200"
                                }`}
                            onClick={() => setLocationType("In-Person")}
                        >
                            📍 In-Person
                        </button>
                        <button
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${locationType === "Remote"
                                ? "bg-[#109C3D] text-white shadow-md"
                                : "bg-gray-100 text-[#063A41] hover:bg-gray-200"
                                }`}
                            onClick={() => setLocationType("Remote")}
                        >
                            💻 Remote
                        </button>
                    </div>

                    {locationType === "In-Person" && (
                        <input
                            type="text"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            placeholder="Enter your full address"
                            className="w-full border-2 border-gray-200 rounded-lg p-4 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors"
                        />
                    )}
                </div>

                {/* Service Category */}
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-3 text-lg">
                        Select a category <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-4 rounded-lg border-2 border-gray-200 text-[#063A41] font-medium focus:outline-none focus:border-[#109C3D] transition-colors"
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
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-3 text-lg">
                        Describe your task <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={5}
                        value={taskForm.taskDescription || ""}
                        onChange={(e) =>
                            dispatch(updateTaskField({ field: "taskDescription", value: e.target.value }))
                        }
                        placeholder="Provide as many details as possible..."
                        className="w-full border-2 border-gray-200 rounded-lg p-4 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors resize-none"
                    />
                    <div className="mt-2 flex items-start gap-2 bg-[#E5FFDB] p-3 rounded-lg">
                        <span className="text-[#109C3D] text-xl">💡</span>
                        <p className="text-[#063A41] text-sm">
                            <strong>Tip:</strong> Include details like size, materials, and any specific requirements to get better quotes.
                        </p>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-3 text-lg">
                        Add photos (optional)
                    </label>
                    <p className="text-gray-600 text-sm mb-4">
                        Photos help taskers understand your job better
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map((index) => (
                            <label
                                key={index}
                                className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col justify-center items-center text-gray-400 cursor-pointer hover:border-[#109C3D] hover:bg-[#E5FFDB] transition-all overflow-hidden relative group"
                            >
                                {images[index] ? (
                                    <Image
                                        src={URL.createObjectURL(images[index])}
                                        alt={`Upload ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <>
                                        <svg className="w-8 h-8 mb-2 text-gray-400 group-hover:text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-xs group-hover:text-[#109C3D]">Add photo</span>
                                    </>
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

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t-2 border-gray-100">
                    <button
                        onClick={onBack}
                        className="text-[#063A41] font-semibold hover:text-[#109C3D] transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    <button
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all shadow-md ${isFormValid
                            ? "bg-[#109C3D] text-white hover:bg-[#0d8332] hover:shadow-lg cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrgentTaskDetails;