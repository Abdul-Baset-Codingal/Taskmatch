"use client";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateTaskField,
    setPhotos,
    setVideo,
} from "@/features/taskForm/taskFormSlice";
import { RootState } from "@/app/store";

type Props = {
    onBack: () => void;
    onContinue: () => void;
};

const UrgentTaskDetails = ({ onBack, onContinue }: Props) => {
    const dispatch = useDispatch();
    const taskForm = useSelector((state: RootState) => state.taskForm);

    const [images, setImages] = useState<File[]>(taskForm.photos || []);
    const [video, setLocalVideo] = useState<File | null>(taskForm.video);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        if (!e.target.files) return;
        const newImages = [...images];
        newImages[index] = e.target.files[0];
        setImages(newImages);
        dispatch(setPhotos(newImages));
    };

    const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setLocalVideo(file);
            dispatch(setVideo(file));
        }
    };

    const handleContinue = () => {
        onContinue(); // all dispatches are already done in onChange
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">2. Task Details</h2>
            <p className="text-lg mb-4">Tell us about your task</p>

            <div className="space-y-6">
                {/* Task Title */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={taskForm.taskTitle}
                        onChange={(e) =>
                            dispatch(updateTaskField({ field: "taskTitle", value: e.target.value }))
                        }
                        placeholder="e.g., Fix My Car Brakes"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
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

                {/* Location
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={taskForm.location}
                        onChange={(e) =>
                            dispatch(updateTaskField({ field: "location", value: e.target.value }))
                        }
                        placeholder="Dhaka, Bangladesh"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button className="mt-2 text-sm text-orange-600 hover:underline">
                        📍 Use my location
                    </button>
                </div> */}

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

                {/* Video Upload */}
                <div className="mt-6">
                    <label className="block text-sm font-medium mb-2">
                        🎥 Video (max 5 seconds)
                    </label>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex justify-center items-center text-gray-400 cursor-pointer hover:border-orange-400 relative overflow-hidden">
                        {video ? (
                            <video
                                src={URL.createObjectURL(video)}
                                controls
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span>🎬 Add 5-second video</span>
                        )}
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                        Show your task in action
                    </p>
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
