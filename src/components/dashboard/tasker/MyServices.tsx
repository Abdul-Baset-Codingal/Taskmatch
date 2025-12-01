/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/features/auth/authApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Save, Calendar, DollarSign, Clock as ClockIcon, User, MapPin, Wrench, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HiOutlineBriefcase } from "react-icons/hi";

const MyServices = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [formData, setFormData] = useState({
        services: [] as { title: string; description: string; hourlyRate: number; estimatedDuration: string }[],
        availability: [] as { day: string; from: string; to: string }[],
        yearsOfExperience: "",
        skills: [] as string[],
        categories: [] as string[],
        serviceAreas: [] as string[],
    });
    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
    const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
    const [editingService, setEditingService] = useState<{ index: number; data: { title: string; description: string; hourlyRate: number; estimatedDuration: string } } | null>(null);
    const [newService, setNewService] = useState({
        title: "",
        description: "",
        hourlyRate: 0,
        estimatedDuration: "",
    });
    const [useCustomTitle, setUseCustomTitle] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [newServiceArea, setNewServiceArea] = useState("");
    const [activeSection, setActiveSection] = useState<string>('profile');

    const categoryOptions = [
        "Handyman & Home Repairs",
        "Renovation & Moving Help",
        "Pet Services",
        "Cleaning Services",
        "Plumbing, Electrical & HVAC (PEH)",
        "Automotive Services",
        "All Other Specialized Services",
    ];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const timeOptions = Array.from({ length: 48 }, (_, i) => {
        const hours = Math.floor(i / 2).toString().padStart(2, "0");
        const minutes = i % 2 === 0 ? "00" : "30";
        return `${hours}:${minutes}`;
    });

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(user);
            } else {
                router.push("/login");
            }
        };
        fetchUser();
    }, [router]);

    const { data: userDetails, refetch, isLoading: isUserLoading } = useGetUserByIdQuery(user?._id || "", {
        skip: !user?._id,
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (userDetails && userDetails.user && user?._id) {
            setFormData({
                services: userDetails.user.services || [],
                availability: userDetails.user.availability || [],
                yearsOfExperience: userDetails.user.yearsOfExperience || "",
                skills: userDetails.user.skills || [],
                categories: userDetails.user.categories || [],
                serviceAreas: userDetails.user.serviceAreas || [],
            });
        }
    }, [userDetails, user]);

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const resetNewService = () => {
        setNewService({ title: "", description: "", hourlyRate: 0, estimatedDuration: "" });
        setUseCustomTitle(false);
    };

    const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "title") {
            if (value === "custom") {
                setUseCustomTitle(true);
                return;
            }
            if (useCustomTitle && e.target.tagName === 'SELECT' && value !== "custom") {
                setNewService({ ...newService, title: value });
                setUseCustomTitle(false);
                return;
            }
        }
        setNewService({ ...newService, [name]: name === "hourlyRate" ? parseFloat(value) || 0 : value });
    };

    const handleAddOrUpdateService = () => {
        if (!newService.title || !newService.description || newService.hourlyRate <= 0 || !newService.estimatedDuration) {
            toast.error("Please fill all service fields.");
            return;
        }

        if (isEditServiceOpen && editingService) {
            const newServices = [...formData.services];
            newServices[editingService.index] = { ...newService };
            setFormData({ ...formData, services: newServices });
            toast.success("Service updated successfully!");
        } else {
            setFormData({
                ...formData,
                services: [...formData.services, { ...newService }],
            });
            toast.success("Service added successfully!");
        }

        resetNewService();
        setIsAddServiceOpen(false);
        setIsEditServiceOpen(false);
        setEditingService(null);
    };

    const startEditingService = (index: number) => {
        const service = formData.services[index];
        setNewService(service);
        setEditingService({ index, data: service });
        const isCustom = !categoryOptions.includes(service.title) && service.title !== "";
        setUseCustomTitle(isCustom);
        setIsEditServiceOpen(true);
    };

    const removeService = (index: number) => {
        setFormData({
            ...formData,
            services: formData.services.filter((_, i) => i !== index),
        });
        toast.success("Service removed successfully!");
    };

    const handleAvailabilityChange = (day: string, field: string, value: string) => {
        const newAvailability = [...formData.availability];
        let slot = newAvailability.find(s => s.day === day);
        if (!slot) {
            slot = { day, from: "", to: "" };
            newAvailability.push(slot);
        }
        slot[field as "from" | "to"] = value;
        setFormData({ ...formData, availability: newAvailability });
    };

    const removeAvailability = (day: string) => {
        setFormData({
            ...formData,
            availability: formData.availability.filter(s => s.day !== day),
        });
        toast.success(`Availability for ${day} removed.`);
    };

    const handleYearsOfExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, yearsOfExperience: e.target.value });
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
            setNewSkill("");
            toast.success("Skill added!");
        } else {
            toast.error("Please enter a valid skill.");
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    const handleCategoryToggle = (category: string) => {
        const newCategories = formData.categories.includes(category)
            ? formData.categories.filter(c => c !== category)
            : [...formData.categories, category];
        setFormData({ ...formData, categories: newCategories });
    };

    const handleAddServiceArea = () => {
        if (newServiceArea.trim() && !formData.serviceAreas.includes(newServiceArea.trim())) {
            setFormData({ ...formData, serviceAreas: [...formData.serviceAreas, newServiceArea.trim()] });
            setNewServiceArea("");
            toast.success("Service area added!");
        } else {
            toast.error("Please enter a valid service area.");
        }
    };

    const removeServiceArea = (area: string) => {
        setFormData({ ...formData, serviceAreas: formData.serviceAreas.filter(a => a !== area) });
    };

    const handleSaveProfile = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        try {
            await updateUser({
                userId: user._id,
                yearsOfExperience: formData.yearsOfExperience,
                skills: formData.skills,
                categories: formData.categories,
                serviceAreas: formData.serviceAreas,
            }).unwrap();
            await refetch();
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };

    const handleSaveServices = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        try {
            await updateUser({
                userId: user._id,
                services: formData.services,
            }).unwrap();
            await refetch();
            toast.success("Services updated successfully!");
        } catch (err: any) {
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };

    const handleSaveAvailability = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        const currentAvailability = formData.availability;
        const partialSlots = currentAvailability.filter(s => !s.from || !s.to);
        let validAvailability = currentAvailability.filter(s => s.from && s.to);

        if (partialSlots.length > 0) {
            setFormData(prev => ({ ...prev, availability: validAvailability }));
            toast.warn(`Removed incomplete time slots.`);
        }

        if (validAvailability.length === 0) {
            toast.info("No availability slots to save.");
            return;
        }

        try {
            await updateUser({
                userId: user._id,
                availability: validAvailability,
            }).unwrap();
            await refetch();
            toast.success("Availability updated successfully!");
        } catch (err: any) {
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'services', label: 'Services', icon: Wrench },
        { id: 'availability', label: 'Availability', icon: Calendar },
    ];

    // Loading
    if (isUserLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!userDetails || !userDetails.user) {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
                    <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineBriefcase className="w-8 h-8 text-[#063A41]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#063A41] mb-2">Loading Profile</h2>
                    <p className="text-gray-500">Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E5FFDB]/10">
            {/* Header */}
            <div className="bg-[#063A41]">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-white">My Services & Profile</h1>
                    <p className="text-[#E5FFDB] text-sm mt-1">Manage your professional profile and offerings</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveSection(tab.id)}
                                    className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeSection === tab.id
                                            ? "border-[#109C3D] text-[#063A41]"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${activeSection === tab.id ? 'text-[#109C3D]' : ''}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Profile Section */}
                {activeSection === 'profile' && (
                    <div className="space-y-6">
                        {/* Experience */}
                        <div className="bg-white rounded-lg border p-5">
                            <label className="block text-sm font-medium text-[#063A41] mb-2">
                                Years of Experience
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 5+ years"
                                value={formData.yearsOfExperience}
                                onChange={handleYearsOfExperienceChange}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                            />
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-lg border p-5">
                            <label className="block text-sm font-medium text-[#063A41] mb-3">Skills</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Add a skill (e.g., Painting)"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                />
                                <button
                                    onClick={handleAddSkill}
                                    className="px-4 py-3 bg-[#109C3D] text-white rounded-lg hover:bg-[#0d8534] transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E5FFDB] text-[#063A41] text-sm rounded-full"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="ml-1 text-[#063A41]/60 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {formData.skills.length === 0 && (
                                    <p className="text-sm text-gray-400">No skills added yet</p>
                                )}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white rounded-lg border p-5">
                            <label className="block text-sm font-medium text-[#063A41] mb-3">Service Categories</label>
                            <div className="grid sm:grid-cols-2 gap-2">
                                {categoryOptions.map((category) => (
                                    <label
                                        key={category}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.categories.includes(category)
                                                ? 'border-[#109C3D] bg-[#E5FFDB]/50'
                                                : 'border-gray-200 hover:border-[#109C3D]/50'
                                            }`}
                                    >
                                        <Checkbox
                                            checked={formData.categories.includes(category)}
                                            onCheckedChange={() => handleCategoryToggle(category)}
                                            className="border-gray-300 data-[state=checked]:bg-[#109C3D] data-[state=checked]:border-[#109C3D]"
                                        />
                                        <span className="text-sm text-[#063A41]">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Service Areas */}
                        <div className="bg-white rounded-lg border p-5">
                            <label className="block text-sm font-medium text-[#063A41] mb-3">Service Areas</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Add a service area (e.g., Toronto)"
                                    value={newServiceArea}
                                    onChange={(e) => setNewServiceArea(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddServiceArea()}
                                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                />
                                <button
                                    onClick={handleAddServiceArea}
                                    className="px-4 py-3 bg-[#109C3D] text-white rounded-lg hover:bg-[#0d8534] transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.serviceAreas.map((area, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E5FFDB] text-[#063A41] text-sm rounded-full"
                                    >
                                        <MapPin className="w-3 h-3" />
                                        {area}
                                        <button
                                            onClick={() => removeServiceArea(area)}
                                            className="ml-1 text-[#063A41]/60 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {formData.serviceAreas.length === 0 && (
                                    <p className="text-sm text-gray-400">No service areas added yet</p>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveProfile}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                )}

                {/* Services Section */}
                {activeSection === 'services' && (
                    <div className="space-y-4">
                        {/* Add Service Button */}
                        <button
                            onClick={() => {
                                resetNewService();
                                setIsAddServiceOpen(true);
                            }}
                            disabled={formData.services.length >= 3}
                            className="w-full py-3 border-2 border-dashed border-[#109C3D] text-[#109C3D] font-medium rounded-lg hover:bg-[#E5FFDB]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Service {formData.services.length > 0 && `(${formData.services.length}/3)`}
                        </button>

                        {/* Services List */}
                        {formData.services.length === 0 ? (
                            <div className="bg-white rounded-lg border p-12 text-center">
                                <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Wrench className="w-8 h-8 text-[#109C3D]" />
                                </div>
                                <h3 className="text-lg font-medium text-[#063A41] mb-1">No services yet</h3>
                                <p className="text-gray-500 text-sm">Add your first service to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {formData.services.map((service, index) => (
                                    <div key={index} className="bg-white rounded-lg border hover:border-[#109C3D]/30 transition-all p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-[#063A41] mb-1">{service.title}</h4>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{service.description}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E5FFDB] text-[#109C3D] text-xs font-medium rounded">
                                                        <DollarSign className="w-3 h-3" />
                                                        ${service.hourlyRate}/hr
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                                        <ClockIcon className="w-3 h-3" />
                                                        {service.estimatedDuration}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => startEditingService(index)}
                                                    className="p-2 text-gray-400 hover:text-[#109C3D] hover:bg-[#E5FFDB]/50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeService(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Save Button */}
                        {formData.services.length > 0 && (
                            <button
                                onClick={handleSaveServices}
                                disabled={isUpdating}
                                className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isUpdating ? "Saving..." : "Save Services"}
                            </button>
                        )}
                    </div>
                )}

                {/* Availability Section */}
                {activeSection === 'availability' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border divide-y">
                            {days.map((day) => {
                                const slot = formData.availability.find(s => s.day === day);
                                const isSet = slot?.from && slot?.to;

                                return (
                                    <div key={day} className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${isSet ? 'bg-[#109C3D]' : 'bg-gray-300'}`}></div>
                                                <span className="font-medium text-[#063A41]">{day}</span>
                                            </div>
                                            {isSet && (
                                                <span className="text-xs font-medium text-[#109C3D] bg-[#E5FFDB] px-2 py-1 rounded">
                                                    {slot?.from} - {slot?.to}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">From</label>
                                                <select
                                                    value={slot?.from || ""}
                                                    onChange={(e) => handleAvailabilityChange(day, "from", e.target.value)}
                                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                                >
                                                    <option value="">Select time</option>
                                                    {timeOptions.map((time) => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">To</label>
                                                <select
                                                    value={slot?.to || ""}
                                                    onChange={(e) => handleAvailabilityChange(day, "to", e.target.value)}
                                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                                >
                                                    <option value="">Select time</option>
                                                    {timeOptions.map((time) => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {isSet && (
                                            <button
                                                onClick={() => removeAvailability(day)}
                                                className="mt-3 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveAvailability}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Saving..." : "Save Availability"}
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Service Dialog */}
            <Dialog open={isAddServiceOpen || isEditServiceOpen} onOpenChange={(open) => {
                if (!open) {
                    resetNewService();
                    setIsAddServiceOpen(false);
                    setIsEditServiceOpen(false);
                    setEditingService(null);
                }
            }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-[#063A41]">
                            {isEditServiceOpen ? "Edit Service" : "Add New Service"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditServiceOpen ? "Update the details of your service." : "Fill in the details for your new service."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-1.5">Service Title</label>
                            <select
                                name="title"
                                value={useCustomTitle ? "custom" : newService.title}
                                onChange={handleNewServiceChange}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                            >
                                <option value="">Select a service type</option>
                                {categoryOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                                <option value="custom">Custom Service...</option>
                            </select>
                            {useCustomTitle && (
                                <input
                                    name="title"
                                    placeholder="Enter custom service title"
                                    value={newService.title}
                                    onChange={handleNewServiceChange}
                                    className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-1.5">Hourly Rate ($)</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                placeholder="0.00"
                                value={newService.hourlyRate || ""}
                                onChange={handleNewServiceChange}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-1.5">Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe your service..."
                                value={newService.description}
                                onChange={handleNewServiceChange}
                                rows={3}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-1.5">Estimated Duration</label>
                            <input
                                name="estimatedDuration"
                                placeholder="e.g., 2 hours"
                                value={newService.estimatedDuration}
                                onChange={handleNewServiceChange}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <button
                            onClick={() => {
                                resetNewService();
                                setIsAddServiceOpen(false);
                                setIsEditServiceOpen(false);
                                setEditingService(null);
                            }}
                            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddOrUpdateService}
                            className="px-4 py-2 bg-[#109C3D] text-white rounded-lg hover:bg-[#0d8534] transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isEditServiceOpen ? "Update" : "Add"} Service
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyServices;