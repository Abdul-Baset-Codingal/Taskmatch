/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/features/auth/authApi";
import { FaUser, FaBriefcase, FaMapMarkerAlt, FaTimes, FaUpload, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Navbar from "@/shared/Navbar";
import { toast } from "react-toastify";

const EditProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        postalCode: "",
        password: "",
        idType: "",
        govID: "",
        govIDBack: "",
        serviceCategories: [] as string[],
        skills: [] as string[],
        experienceYears: "",
        qualifications: [] as string[],
        services: [] as { title: string; description: string; hourlyRate: number; estimatedDuration: string }[],
        certifications: [] as string[],
        backgroundCheckConsent: false,
        hasInsurance: false,
        availability: [] as { day: string; from: string; to: string }[],
        serviceAreas: [] as string[],
        profilePicture: "",
    });
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<{ [key: string]: string | null }>({});
    const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
    const [dragOver, setDragOver] = useState<{ [key: string]: boolean }>({
        profilePicture: false,
        govID: false,
        govIDBack: false,
        certifications: false,
    });
    const [newService, setNewService] = useState({
        title: "",
        description: "",
        hourlyRate: 0,
        estimatedDuration: "",
    });
    const [useCustomTitle, setUseCustomTitle] = useState(false);

    // Predefined service options
    const serviceOptions = [
        "Complete Cleaning",
        "Pet Services",
        "Plumbing, Electrical & HVAC (PEH)",
        "Home Cleaning & Organization",
        "Tech Assistance",
        "Household chores & cleaning",
        "Moving & packing help",
        "Repairs & handyman services",
        "Other",
    ];

    // Days for availability
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Time options (every 30 minutes from 00:00 to 23:30)
    const timeOptions = Array.from({ length: 48 }, (_, i) => {
        const hours = Math.floor(i / 2).toString().padStart(2, "0");
        const minutes = i % 2 === 0 ? "00" : "30";
        return `${ hours }:${ minutes } `;
    });

    // Check login status
    const checkLoginStatus = async () => {
        try {
            const response = await fetch(`${ process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
                method: "GET",
                credentials: "include",
            });
            const text = await response.text();
            console.log("Verify token response:", text);
            if (response.ok) {
                const data = JSON.parse(text);
                console.log("Parsed user data:", data);
                setUser({ _id: data.user._id, role: data.user.role });
            } else {
                console.error("Verify token failed:", response.status, text);
                setUser(null);
                router.push("/login");
            }
        } catch (error) {
            console.error("Error checking login status:", error);
            setUser(null);
            router.push("/login");
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const { data: userDetails, refetch, error: userError, isFetching, isLoading } = useGetUserByIdQuery(user?._id, {
        skip: !user?._id,
    });

    // Log query status
    useEffect(() => {
        if (userError) console.error("getUserById error:", userError);
        if (userDetails) console.log("getUserById success:", userDetails);
        if (isFetching) console.log("getUserById is fetching...");
    }, [userError, userDetails, isFetching]);

    // Populate formData with userDetails
    useEffect(() => {
        if (userDetails && user?._id) {
            console.log("Populating formData with userDetails:", userDetails);
            setFormData({
                firstName: userDetails.firstName || "",
                lastName: userDetails.lastName || "",
                email: userDetails.email || "",
                phone: userDetails.phone || "",
                postalCode: userDetails.postalCode || "",
                password: "",
                idType: userDetails.idType || "",
                govID: userDetails.governmentId || "",
                govIDBack: userDetails.govIDBack || "",
                serviceCategories: userDetails.categories || [],
                skills: userDetails.skills || [],
                experienceYears: userDetails.yearsOfExperience || "",
                qualifications: userDetails.qualifications || [],
                services: userDetails.services || [],
                certifications: userDetails.certifications || [],
                backgroundCheckConsent: userDetails.backgroundCheckConsent || false,
                hasInsurance: userDetails.hasInsurance || false,
                availability: userDetails.availability || [],
                serviceAreas: userDetails.serviceAreas || [],
                profilePicture: userDetails.profilePicture || "",
            });
        }
    }, [userDetails, user]);

    const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        console.log(`Input change: ${ name }=${ value } `);
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleArrayInputChange = (name: string, value: string) => {
        console.log(`Array input change: ${ name }=${ value } `);
        setFormData({
            ...formData,
            [name]: value.split(",").map(item => item.trim()).filter(item => item.length > 0),
        });
    };

    const handleAvailabilityChange = (day: string, field: string, value: string) => {
        console.log(`Availability change: day = ${ day }, field = ${ field }, value = ${ value } `);
        const newAvailability = [...formData.availability];
        let slot = newAvailability.find(s => s.day === day);
        if (!slot) {
            slot = { day, from: field === "from" ? value : "", to: field === "to" ? value : "" };
            newAvailability.push(slot);
        } else {
            slot[field] = value;
        }
        setFormData({ ...formData, availability: newAvailability.filter(s => s.from && s.to) });
    };

    const handleServiceChange = (index: number, field: string, value: string | number) => {
        console.log(`Service change: index = ${ index }, field = ${ field }, value = ${ value } `);
        const newServices = [...formData.services];
        newServices[index] = { ...newServices[index], [field]: value };
        setFormData({ ...formData, services: newServices });
    };

    const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(`New service change: ${ name }=${ value } `);
        setNewService({ ...newService, [name]: name === "hourlyRate" ? parseFloat(value) || 0 : value });
    };

    const addNewService = () => {
        if (!newService.title) {
            alert("Please select or enter a service title.");
            return;
        }
        console.log("Adding new service:", newService);
        setFormData({
            ...formData,
            services: [...formData.services, newService],
        });
        setNewService({ title: "", description: "", hourlyRate: 0, estimatedDuration: "" });
        setUseCustomTitle(false);
    };

    const removeService = (index: number) => {
        console.log(`Removing service at index ${ index } `);
        setFormData({
            ...formData,
            services: formData.services.filter((_, i) => i !== index),
        });
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isMultiple: boolean = false) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            console.log(`No files selected for ${ field }`);
            setUploadError(prev => ({ ...prev, [field]: `No files selected for ${ field }` }));
            return;
        }

        const API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '8b35d4601167f12207fbc7c8117f897e';
        const urls: string[] = [];
        setIsUploading(prev => ({ ...prev, [field]: true }));
        setUploadError(prev => ({ ...prev, [field]: null }));
        console.log(`Starting upload for ${ field }, isMultiple = ${ isMultiple }, files = ${ files.length } `);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log(`Uploading file ${ i + 1 }/${files.length} for ${field}`);
const uploadData = new FormData();
uploadData.append('image', file);
const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: 'POST',
    body: uploadData,
});
const data = await res.json();
if (data.success) {
    urls.push(data.data.url);
    console.log(`Uploaded ${field} image: ${data.data.url}`);
} else {
    console.error(`Upload failed for ${field}:`, data);
    throw new Error(data.error?.message || `Failed to upload ${field}`);
}
            }

setFormData(prev => {
    const updatedField = isMultiple ? [...(prev[field as keyof typeof prev] as string[] || []), ...urls] : urls[0];
    console.log(`Updated formData for ${field}:`, updatedField);
    return { ...prev, [field]: updatedField };
});
        } catch (err) {
    console.error(`Upload error for ${field}:`, err);
    setUploadError(prev => ({
        ...prev,
        [field]: `Failed to upload ${field}: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }));
} finally {
    setIsUploading(prev => ({ ...prev, [field]: false }));
    console.log(`Upload completed for ${field}, isUploading=false`);
}
    };

const handleDrop = (e: React.DragEvent<HTMLDivElement>, field: string, isMultiple: boolean = false) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [field]: false }));
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handlePhotoUpload({ target: { files } } as any, field, isMultiple);
    }
};

const removeCertification = (index: number) => {
    console.log(`Removing certification at index ${index}`);
    setFormData(prev => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index),
    }));
};

const handleSaveChanges = async () => {
    if (!user?._id) {
        alert("Error: User not logged in");
        return;
    }
    try {
        console.log("Submitting update for user ID:", user._id, "formData:", formData);
        const result = await updateUser({ userId: user._id, ...formData }).unwrap();
        console.log("Update result:", result);
        if (!isFetching && user._id) {
            console.log("Refetching user data for ID:", user._id);
            await refetch();
        }
        toast.success("Profile updated successfully!");
        router.push("/dashboard/tasker");
    } catch (err: any) {
        console.error("Failed to update profile:", err);
        toast.error(`Failed to update profile: ${err.data?.error || err.message || "Unknown error"}`);
    }
};

const toggleSection = (e: React.MouseEvent, section: string) => {
    e.stopPropagation();
    console.log(`Toggling section: ${section}, current expanded: ${expandedSection}`);
    setExpandedSection(expandedSection === section ? null : section);
};

return (
    <div>
        <Navbar />
        <section className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Edit Your Profile</h1>
                    <p className="text-gray-600 mt-2">Personalize your tasker profile to stand out!</p>
                </div>

                {isLoading ? (
                    <p className="text-gray-600 text-center text-lg">Loading profile data...</p>
                ) : (
                    <div className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex justify-center">
                            <div className="w-48 h-48 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-green-200 transition-all duration-200 hover:shadow-lg">
                                <div className="text-center">
                                    <label className="text-gray-700 text-sm font-medium block mb-2">Profile Picture</label>
                                    {formData.profilePicture ? (
                                        <Image
                                            src={formData.profilePicture}
                                            alt="Profile Picture"
                                            width={120}
                                            height={120}
                                            className="rounded-full object-cover mx-auto"
                                            onError={() => setFormData(prev => ({ ...prev, profilePicture: "" }))}
                                        />
                                    ) : (
                                        <FaUser className="text-3xl text-green-600 mx-auto mb-2" />
                                    )}
                                    <div
                                        className={`mt-2 p-3 border-2 border-dashed rounded-lg transition-all duration-200 ${dragOver.profilePicture ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-100"}`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragOver(prev => ({ ...prev, profilePicture: true }));
                                        }}
                                        onDragLeave={() => setDragOver(prev => ({ ...prev, profilePicture: false }))}
                                        onDrop={(e) => handleDrop(e, "profilePicture")}
                                        onClick={() => document.getElementById("profilePictureInput")?.click()}
                                    >
                                        <FaUpload className="text-xl text-green-600 mx-auto mb-1" />
                                        <p className="text-xs text-gray-600">Drag & drop or click</p>
                                        <input
                                            id="profilePictureInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handlePhotoUpload(e, "profilePicture")}
                                            disabled={isUploading.profilePicture}
                                            className="hidden"
                                        />
                                    </div>
                                    {isUploading.profilePicture && (
                                        <p className="text-green-600 text-xs mt-1 flex items-center justify-center gap-1">
                                            <FaUpload className="animate-spin" /> Uploading...
                                        </p>
                                    )}
                                    {uploadError.profilePicture && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center justify-center gap-1">
                                            <FaExclamationCircle /> {uploadError.profilePicture}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaUser className="text-green-600" />
                                    <h3 className="text-gray-800 font-semibold">Personal Details</h3>
                                </div>
                                <label className="text-gray-700 text-sm font-medium block mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First Name"
                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                />
                                <label className="text-gray-700 text-sm font-medium block mt-3 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last Name"
                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                />
                                <label className="text-gray-700 text-sm font-medium block mt-3 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password (leave blank to keep)"
                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                />
                            </div>
                            <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaMapMarkerAlt className="text-green-600" />
                                    <h3 className="text-gray-800 font-semibold">Contact Info</h3>
                                </div>
                                <label className="text-gray-700 text-sm font-medium block mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                />
                                <label className="text-gray-700 text-sm font-medium block mt-3 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Phone"
                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                />
                                <label className="text-gray-700 text-sm font-medium block mt-3 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Postal Code"
                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Tasker Details */}
                        {userDetails?.role === "tasker" && (
                            <div className="space-y-4">
                                <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm border border-gray-100">
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={(e) => toggleSection(e, "services")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaBriefcase className="text-green-600" />
                                            <h3 className="text-gray-800 font-semibold">Services & Skills</h3>
                                        </div>
                                        <span className="text-green-600 text-lg">{expandedSection === "services" ? "−" : "+"}</span>
                                    </div>
                                    {expandedSection === "services" && (
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-2">Current Services</label>
                                                {formData.services.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {formData.services.map((service, index) => (
                                                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <h4 className="text-gray-800 font-medium">{service.title}</h4>
                                                                    <button
                                                                        onClick={() => removeService(index)}
                                                                        className="text-red-500 hover:text-red-600 text-sm"
                                                                    >
                                                                        <FaTimes />
                                                                    </button>
                                                                </div>
                                                                <label className="text-gray-700 text-xs font-medium block mb-1">Description</label>
                                                                <textarea
                                                                    value={service.description}
                                                                    onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                                                                    placeholder="Describe the service"
                                                                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                                    rows={3}
                                                                />
                                                                <label className="text-gray-700 text-xs font-medium block mt-2 mb-1">Hourly Rate ($)</label>
                                                                <input
                                                                    type="number"
                                                                    value={service.hourlyRate}
                                                                    onChange={(e) => handleServiceChange(index, "hourlyRate", parseFloat(e.target.value) || 0)}
                                                                    placeholder="e.g., 25"
                                                                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                                />
                                                                <label className="text-gray-700 text-xs font-medium block mt-2 mb-1">Estimated Duration</label>
                                                                <input
                                                                    type="text"
                                                                    value={service.estimatedDuration}
                                                                    onChange={(e) => handleServiceChange(index, "estimatedDuration", e.target.value)}
                                                                    placeholder="e.g., 2 hours"
                                                                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-600 text-sm">No services added yet.</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-2">Add New Service</label>
                                                <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={useCustomTitle}
                                                            onChange={() => setUseCustomTitle(!useCustomTitle)}
                                                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                        />
                                                        <label className="text-gray-700 text-xs font-medium">Use Custom Title</label>
                                                    </div>
                                                    {useCustomTitle ? (
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            value={newService.title}
                                                            onChange={handleNewServiceChange}
                                                            placeholder="Enter custom service title"
                                                            className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                        />
                                                    ) : (
                                                        <select
                                                            name="title"
                                                            value={newService.title}
                                                            onChange={handleNewServiceChange}
                                                            className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                        >
                                                            <option value="">Select a service</option>
                                                            {serviceOptions.map((option) => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    <label className="text-gray-700 text-xs font-medium block mt-2 mb-1">Description</label>
                                                    <textarea
                                                        name="description"
                                                        value={newService.description}
                                                        onChange={handleNewServiceChange}
                                                        placeholder="Describe the service"
                                                        className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                        rows={3}
                                                    />
                                                    <label className="text-gray-700 text-xs font-medium block mt-2 mb-1">Hourly Rate ($)</label>
                                                    <input
                                                        type="number"
                                                        name="hourlyRate"
                                                        value={newService.hourlyRate}
                                                        onChange={handleNewServiceChange}
                                                        placeholder="e.g., 25"
                                                        className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                    />
                                                    <label className="text-gray-700 text-xs font-medium block mt-2 mb-1">Estimated Duration</label>
                                                    <input
                                                        type="text"
                                                        name="estimatedDuration"
                                                        value={newService.estimatedDuration}
                                                        onChange={handleNewServiceChange}
                                                        placeholder="e.g., 2 hours"
                                                        className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                    />
                                                    <button
                                                        onClick={addNewService}
                                                        className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 mt-2"
                                                    >
                                                        Add Service
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-1">Service Categories</label>
                                                <input
                                                    type="text"
                                                    name="serviceCategories"
                                                    value={formData.serviceCategories.join(", ")}
                                                    onChange={(e) => handleArrayInputChange("serviceCategories", e.target.value)}
                                                    placeholder="e.g., Cleaning, Pet Care"
                                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-1">Skills</label>
                                                <input
                                                    type="text"
                                                    name="skills"
                                                    value={formData.skills.join(", ")}
                                                    onChange={(e) => handleArrayInputChange("skills", e.target.value)}
                                                    placeholder="e.g., Plumbing, Organizing"
                                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-1">Qualifications</label>
                                                <input
                                                    type="text"
                                                    name="qualifications"
                                                    value={formData.qualifications.join(", ")}
                                                    onChange={(e) => handleArrayInputChange("qualifications", e.target.value)}
                                                    placeholder="e.g., Certified Electrician"
                                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-1">Certifications</label>
                                                <div
                                                    className={`p-3 border-2 border-dashed rounded-lg transition-all duration-200 ${dragOver.certifications ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-100"}`}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setDragOver(prev => ({ ...prev, certifications: true }));
                                                    }}
                                                    onDragLeave={() => setDragOver(prev => ({ ...prev, certifications: false }))}
                                                    onDrop={(e) => handleDrop(e, "certifications", true)}
                                                    onClick={() => document.getElementById("certificationsInput")?.click()}
                                                >
                                                    {formData.certifications.length > 0 ? (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                            {formData.certifications.map((cert, index) => (
                                                                <div key={index} className="relative">
                                                                    <Image
                                                                        src={cert}
                                                                        alt={`Certification ${index + 1}`}
                                                                        width={120}
                                                                        height={80}
                                                                        className="rounded-lg object-cover"
                                                                        onError={() => removeCertification(index)}
                                                                    />
                                                                    <button
                                                                        onClick={() => removeCertification(index)}
                                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                                    >
                                                                        <FaTimes />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <FaUpload className="text-xl text-green-600 mx-auto mb-1" />
                                                            <p className="text-xs text-gray-600 text-center">Drag & drop multiple images or click</p>
                                                        </>
                                                    )}
                                                    <input
                                                        id="certificationsInput"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => handlePhotoUpload(e, "certifications", true)}
                                                        disabled={isUploading.certifications}
                                                        className="hidden"
                                                    />
                                                </div>
                                                {isUploading.certifications && (
                                                    <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                                                        <FaUpload className="animate-spin" /> Uploading...
                                                    </p>
                                                )}
                                                {uploadError.certifications && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <FaExclamationCircle /> {uploadError.certifications}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-1">Years of Experience</label>
                                                <input
                                                    type="number"
                                                    name="experienceYears"
                                                    value={formData.experienceYears}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., 5"
                                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm border border-gray-100">
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={(e) => toggleSection(e, "availability")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-green-600" />
                                            <h3 className="text-gray-800 font-semibold">Availability & Areas</h3>
                                        </div>
                                        <span className="text-green-600 text-lg">{expandedSection === "availability" ? "−" : "+"}</span>
                                    </div>
                                    {expandedSection === "availability" && (
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-2">Availability</label>
                                                <div className="space-y-2">
                                                    {days.map((day) => {
                                                        const slot = formData.availability.find(s => s.day === day) || { day, from: "09:00", to: "17:00", isEnabled: false };
                                                        return (
                                                            <div key={day} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                                <button
                                                                    onClick={() => {
                                                                        const newAvailability = formData.availability.filter(s => s.day !== day);
                                                                        if (slot.isEnabled) {
                                                                            newAvailability.push({ ...slot, isEnabled: false });
                                                                        } else {
                                                                            newAvailability.push({ ...slot, isEnabled: true });
                                                                        }
                                                                        setFormData({ ...formData, availability: newAvailability });
                                                                    }}
                                                                    className={`w-24 text-left font-medium transition-all duration-200 ${slot.isEnabled ? "text-green-600" : "text-gray-600"}`}
                                                                >
                                                                    {day} {slot.isEnabled && <FaCheckCircle className="inline ml-1 text-green-500" />}
                                                                </button>
                                                                {slot.isEnabled && (
                                                                    <>
                                                                        <select
                                                                            value={slot.from}
                                                                            onChange={(e) => handleAvailabilityChange(day, "from", e.target.value)}
                                                                            className="p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 flex-1"
                                                                        >
                                                                            <option value="">From</option>
                                                                            {timeOptions.map((time) => (
                                                                                <option key={time} value={time}>
                                                                                    {time}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <span className="text-gray-600">to</span>
                                                                        <select
                                                                            value={slot.to}
                                                                            onChange={(e) => handleAvailabilityChange(day, "to", e.target.value)}
                                                                            className="p-2 bg-white rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 flex-1"
                                                                        >
                                                                            <option value="">To</option>
                                                                            {timeOptions.map((time) => (
                                                                                <option key={time} value={time}>
                                                                                    {time}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-gray-700 text-sm font-medium block mb-1">Service Areas</label>
                                                <input
                                                    type="text"
                                                    name="serviceAreas"
                                                    value={formData.serviceAreas.join(", ")}
                                                    onChange={(e) => handleArrayInputChange("serviceAreas", e.target.value)}
                                                    placeholder="e.g., Downtown, Suburbs"
                                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/tasker")}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveChanges}
                                disabled={isUpdating || !user?._id || Object.values(isUploading).some(v => v)}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                            >
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                        {/* Error Messages */}
                        {Object.values(uploadError).some(err => err) && (
                            <p className="text-red-500 text-center text-sm mt-4 flex items-center justify-center gap-1">
                                <FaExclamationCircle /> {Object.values(uploadError).find(err => err) || "Upload error"}
                            </p>
                        )}
                        {updateError && (
                            <p className="text-red-500 text-center text-sm mt-4 flex items-center justify-center gap-1">
                                <FaExclamationCircle /> {(updateError as any).data?.error || "Failed to update profile"}
                            </p>
                        )}
                        {userError && (
                            <p className="text-red-500 text-center text-sm mt-4 flex items-center justify-center gap-1">
                                <FaExclamationCircle /> {(userError as any).data?.error || "Failed to fetch user data"}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    </div>
);
};

export default EditProfilePage;
