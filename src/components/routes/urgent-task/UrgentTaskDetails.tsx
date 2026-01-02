// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useMemo, useState, useRef } from "react";
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
    const [selectedService, setSelectedService] = useState<ServiceKey | "">(
        (taskForm.serviceId as ServiceKey) || "handyMan"
    );
    const [images, setImages] = useState<File[]>(taskForm.photos || []);
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [locationType, setLocationType] = useState<"In-Person" | "Remote">(
        taskForm.location === "Remote" ? "Remote" : "In-Person"
    );
    const searchParams = useSearchParams();
    const searchQuery = searchParams ? searchParams.get("search") || "" : "";

    const isGeneralService = searchQuery?.toLowerCase() === "general service";

    const [taskInput, setTaskInput] = useState(isGeneralService ? "" : searchQuery);
    const [inputValue, setInputValue] = useState(isGeneralService ? "" : searchQuery);

    // ✅ FIX: Track if initial sync from Redux is complete
    const isInitialSyncDone = useRef(false);

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

    // ✅ FIX: Parse location from Redux ONLY on initial mount
    useEffect(() => {
        if (isInitialSyncDone.current) return;

        const location = taskForm.location || "";

        if (location === "Remote") {
            setLocationType("Remote");
            setStreet("");
            setCity("");
            setProvince("");
        } else if (location) {
            setLocationType("In-Person");
            const parts = location.split(',').map(p => p.trim());
            if (parts.length >= 3) {
                const provincePart = parts.pop() || '';
                const cityPart = parts.pop() || '';
                const streetPart = parts.join(', ');
                setProvince(provincePart);
                setCity(cityPart);
                setStreet(streetPart);
            } else if (parts.length === 2) {
                setStreet(parts[0]);
                setCity(parts[1]);
                setProvince('');
            } else if (parts.length === 1) {
                setStreet(parts[0]);
                setCity('');
                setProvince('');
            }
        }

        isInitialSyncDone.current = true;
    }, []); // ✅ Empty dependency array - only run once on mount

    // ✅ FIX: Update Redux location when local state changes (after initial sync)
    useEffect(() => {
        // Don't run until initial sync is complete
        if (!isInitialSyncDone.current) return;

        if (locationType === "Remote") {
            dispatch(updateTaskField({ field: "location", value: "Remote" }));
        } else {
            const components = [street, city, province].filter(Boolean);
            const fullAddress = components.join(', ');
            dispatch(updateTaskField({ field: "location", value: fullAddress }));
        }
    }, [locationType, street, city, province, dispatch]);

    // ✅ FIX: Handle location type change separately
    const handleLocationTypeChange = (type: "In-Person" | "Remote") => {
        setLocationType(type);
        if (type === "Remote") {
            setStreet("");
            setCity("");
            setProvince("");
        }
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload only JPG, JPEG, or PNG images.');
            e.target.value = ''; // Reset the input
            return;
        }

        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
        dispatch(setPhotos(newImages));
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        dispatch(setPhotos(newImages));
    };

    // Add this function after handleImageUpload


    // Alternative: Keep position but set to undefined
    const handleRemoveImageAtIndex = (index: number) => {
        const newImages = [...images];
        newImages[index] = undefined as unknown as File;
        const filteredImages = newImages.filter(Boolean);
        setImages(filteredImages);
        dispatch(setPhotos(filteredImages));
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
            (locationType === "In-Person" && street.trim().length > 0 && city.trim().length > 0 && province.trim().length > 0);

        const hasDescription = taskForm.taskDescription?.trim().length > 0;

        const hasService = selectedService && selectedService !== "";

        return hasTitle && hasValidLocation && hasDescription && hasService;
    }, [taskForm.taskTitle, taskForm.taskDescription, locationType, street, city, province, selectedService]);

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
                            type="button"
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${locationType === "In-Person"
                                ? "bg-[#109C3D] text-white shadow-md"
                                : "bg-gray-100 text-[#063A41] hover:bg-gray-200"
                                }`}
                            onClick={() => handleLocationTypeChange("In-Person")}
                        >
                            📍 In-Person
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${locationType === "Remote"
                                ? "bg-[#109C3D] text-white shadow-md"
                                : "bg-gray-100 text-[#063A41] hover:bg-gray-200"
                                }`}
                            onClick={() => handleLocationTypeChange("Remote")}
                        >
                            💻 Remote
                        </button>
                    </div>

                    {locationType === "In-Person" && (
                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                            <input
                                type="text"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="Street Address"
                                className="border-2 border-gray-200 rounded-lg p-4 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors"
                            />
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                className="border-2 border-gray-200 rounded-lg p-4 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors"
                            />
                            <input
                                type="text"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                placeholder="Province"
                                className="border-2 border-gray-200 rounded-lg p-4 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors"
                            />
                        </div>
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
                        <option value="" disabled>Select Your Service</option>
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
                {/* Image Upload */}
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-3 text-lg">
                        Add photos (optional)
                    </label>
                    <p className="text-gray-600 text-sm mb-2">
                        Photos help taskers understand your job better
                    </p>

                    {/* Format Note */}
                    <div className="flex items-center gap-2 mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                        <svg
                            className="w-5 h-5 text-blue-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-blue-700 text-sm">
                            <span className="font-medium">Accepted formats:</span> JPG, JPEG, PNG only 
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="relative">
                                <label
                                    className={`border-2 border-dashed rounded-lg h-32 flex flex-col justify-center items-center cursor-pointer transition-all overflow-hidden relative group ${images[index]
                                            ? 'border-[#109C3D] bg-[#E5FFDB]'
                                            : 'border-gray-300 text-gray-400 hover:border-[#109C3D] hover:bg-[#E5FFDB]'
                                        }`}
                                >
                                    {images[index] ? (
                                        <>
                                            <Image
                                                src={URL.createObjectURL(images[index])}
                                                alt={`Upload ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-medium">Change photo</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-8 h-8 mb-2 text-gray-400 group-hover:text-[#109C3D]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="text-xs group-hover:text-[#109C3D]">Add photo</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                        onChange={(e) => handleImageUpload(e, index)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </label>

                                {/* Remove Button */}
                                {images[index] && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveImage(index);
                                        }}
                                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
                                        title="Remove image"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Additional help text */}
                    {images.length > 0 && (
                        <p className="text-gray-500 text-xs mt-3">
                            {images.filter(Boolean).length} of 3 photos uploaded
                        </p>
                    )}
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