/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/features/auth/authApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Save, Calendar, DollarSign, Clock as ClockIcon, User, MapPin, Wrench, ChevronRight, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/shared/Navbar"; 

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

    // Predefined service category options for categories and services
    const categoryOptions = [
        "Handyman & Home Repairs",
        "Renovation & Moving Help",
        "Pet Services",
        "Cleaning Services",
        "Plumbing, Electrical & HVAC (PEH)",
        "Automotive Services",
        "All Other Specialized Services",
    ];

    // Days for availability
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Time options (every 30 minutes from 00:00 to 23:30)
    const timeOptions = Array.from({ length: 48 }, (_, i) => {
        const hours = Math.floor(i / 2).toString().padStart(2, "0");
        const minutes = i % 2 === 0 ? "00" : "30";
        return `${hours}:${minutes}`;
    });

    // Check login status
    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(user);
                console.log("User object:", user);
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

    // UPDATED: Populate formData directly from userDetails.user (based on console log structure)
    useEffect(() => {
        if (userDetails && userDetails.user && user?._id) {
            console.log('Full userDetails.user:', userDetails.user);  // Debug: Log full structure
            setFormData({
                services: userDetails.user.services || [],
                availability: userDetails.user.availability || [],
                yearsOfExperience: userDetails.user.yearsOfExperience || "",
                skills: userDetails.user.skills || [],
                categories: userDetails.user.categories || [],
                serviceAreas: userDetails.user.serviceAreas || [],
            });
            console.log('Populating formData:', {
                services: userDetails.user.services || [],
                availability: userDetails.user.availability || [],
                yearsOfExperience: userDetails.user.yearsOfExperience || "",
                skills: userDetails.user.skills || [],
                categories: userDetails.user.categories || [],
                serviceAreas: userDetails.user.serviceAreas || [],
            });  // Debug log populated data
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
                // Switching from custom to predefined via select
                setNewService({ ...newService, title: value });
                setUseCustomTitle(false);
                return;
            }
        }
        // For input changes, including custom title input and other fields
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

        // UPDATED: Detect if title is custom (not in predefined options) and init UI accordingly
        const isCustom = !categoryOptions.includes(service.title) && service.title !== "";
        setUseCustomTitle(isCustom);
        // REMOVED: No longer overriding title to "custom" - select value will handle display
        // Debug log
        console.log('Editing service:', service, 'Is custom?', isCustom);
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
        // Remove the filter here—don't discard partial slots
        setFormData({ ...formData, availability: newAvailability });
    };

    const removeAvailability = (day: string) => {
        setFormData({
            ...formData,
            availability: formData.availability.filter(s => s.day !== day),
        });
        toast.success(`Availability for ${day} removed.`);
    };

    // Handle years of experience change
    const handleYearsOfExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, yearsOfExperience: e.target.value });
    };

    // Handle adding/removing skills
    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
            setNewSkill("");
            toast.success("Skill added successfully!");
        } else {
            toast.error("Please enter a valid skill.");
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
        toast.success("Skill removed successfully!");
    };

    // Handle category selection
    const handleCategoryToggle = (category: string) => {
        const newCategories = formData.categories.includes(category)
            ? formData.categories.filter(c => c !== category)
            : [...formData.categories, category];
        setFormData({ ...formData, categories: newCategories });
    };

    // Handle adding/removing service areas
    const handleAddServiceArea = () => {
        if (newServiceArea.trim() && !formData.serviceAreas.includes(newServiceArea.trim())) {
            setFormData({ ...formData, serviceAreas: [...formData.serviceAreas, newServiceArea.trim()] });
            setNewServiceArea("");
            toast.success("Service area added successfully!");
        } else {
            toast.error("Please enter a valid service area.");
        }
    };

    const removeServiceArea = (area: string) => {
        setFormData({ ...formData, serviceAreas: formData.serviceAreas.filter(a => a !== area) });
        toast.success("Service area removed successfully!");
    };

    // NEW: Individual save handlers for partial updates
    const handleSaveProfile = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }

        try {
            const result = await updateUser({
                userId: user._id,
                yearsOfExperience: formData.yearsOfExperience,
                skills: formData.skills,
                categories: formData.categories,
                serviceAreas: formData.serviceAreas,
            }).unwrap();
            await refetch();
            toast.success("Professional profile updated successfully!");
        } catch (err: any) {
            console.error("Failed to update profile:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };

    const handleSaveServices = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }

        try {
            const result = await updateUser({
                userId: user._id,
                services: formData.services,
            }).unwrap();
            await refetch();
            toast.success("Services updated successfully!");
        } catch (err: any) {
            console.error("Failed to update services:", err);
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
            toast.warn(`Removed incomplete time slots for ${partialSlots.map(s => s.day).join(', ')}. Please re-add if needed.`);
        }

        if (validAvailability.length === 0) {
            toast.info("No availability slots to save.");
            return;
        }

        try {
            const result = await updateUser({
                userId: user._id,
                availability: validAvailability,
            }).unwrap();
            await refetch();
            toast.success("Availability updated successfully!");
        } catch (err: any) {
            console.error("Failed to update availability:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };

    const sections = [
        { id: 'profile', title: 'Professional Profile', icon: User },
        { id: 'services', title: 'My Services', icon: Wrench },
        { id: 'availability', title: 'My Availability', icon: Calendar },
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="p-6 space-y-6 bg-white">
                        {/* Years of Experience */}
                        <div className="space-y-2">
                            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-[#063A41]">
                                Years of Experience
                            </label>
                            <input
                                id="yearsOfExperience"
                                type="text"
                                placeholder="e.g., 5+ years"
                                value={formData.yearsOfExperience}
                                onChange={handleYearsOfExperienceChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
                                style={{ borderColor: '#063A41' }}
                            />
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a skill (e.g., Painting, Wiring)"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
                                    style={{ borderColor: '#063A41' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="px-4 py-3 border border-[#063A41] text-[#063A41] rounded-lg hover:bg-[#E5FFDB] transition-all shrink-0"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-2 bg-[#109C3D] text-white text-sm rounded-full shadow-sm"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="ml-2 h-4 w-4 p-0 text-white hover:text-gray-200"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Service Categories */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-[#063A41]">Service Categories</label>
                            <div className="space-y-2">
                                {categoryOptions.map((category) => (
                                    <div key={category} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${category}`}
                                            checked={formData.categories.includes(category)}
                                            onCheckedChange={() => handleCategoryToggle(category)}
                                            className="border-[#063A41] data-[state=checked]:bg-[#109C3D] data-[state=checked]:border-[#109C3D]"
                                        />
                                        <label htmlFor={`category-${category}`} className="text-sm leading-none text-[#063A41] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Service Areas */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a service area (e.g., Toronto, M5V 2T6)"
                                    value={newServiceArea}
                                    onChange={(e) => setNewServiceArea(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddServiceArea()}
                                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
                                    style={{ borderColor: '#063A41' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddServiceArea}
                                    className="px-4 py-3 border border-[#063A41] text-[#063A41] rounded-lg hover:bg-[#E5FFDB] transition-all shrink-0"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.serviceAreas.map((area, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-2 bg-[#109C3D] text-white text-sm rounded-full shadow-sm"
                                    >
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {area}
                                        <button
                                            onClick={() => removeServiceArea(area)}
                                            className="ml-2 h-4 w-4 p-0 text-white hover:text-gray-200"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isUpdating}
                                className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
                            >
                                <Save className="h-4 w-4 mr-2 inline" />
                                {isUpdating ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </div>
                );
            case 'services':
                return (
                    <div className="p-6 bg-white">
                        <button
                            onClick={() => {
                                resetNewService();
                                setIsAddServiceOpen(true);
                            }}
                            disabled={formData.services.length >= 3}
                            className="w-full mb-6 p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <Plus className="h-4 w-4 mr-2 inline" />
                            Add New Service
                        </button>

                        <div className="space-y-4">
                            {formData.services.length === 0 ? (
                                <div className="text-center py-12">
                                    <ClockIcon className="h-12 w-12 text-[#063A41] opacity-50 mx-auto mb-4" />
                                    <p className="text-[#063A41] opacity-70">No services added yet. Start by adding one above!</p>
                                </div>
                            ) : (
                                formData.services.map((service, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm p-6 border" style={{ borderColor: '#063A41' }}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-xl text-[#063A41] mb-2">{service.title}</h4>
                                                <p className="text-[#063A41] opacity-70 mb-3 line-clamp-2">{service.description}</p>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="inline-flex items-center px-3 py-1 bg-[#E5FFDB] text-[#063A41] border rounded-full text-xs font-medium" style={{ borderColor: '#109C3D' }}>
                                                        <DollarSign className="h-3 w-3 mr-1 text-[#109C3D]" />
                                                        ${service.hourlyRate}/hr
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 bg-[#E5FFDB] text-[#063A41] border rounded-full text-xs font-medium" style={{ borderColor: '#109C3D' }}>
                                                        <ClockIcon className="h-3 w-3 mr-1 text-[#109C3D]" />
                                                        {service.estimatedDuration}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => startEditingService(index)}
                                                    className="h-8 w-8 p-0 rounded-full bg-transparent hover:bg-[#E5FFDB] text-[#063A41] transition-all"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeService(index)}
                                                    className="h-8 w-8 p-0 rounded-full bg-transparent hover:bg-red-50 text-red-600 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
                            <button
                                onClick={handleSaveServices}
                                disabled={isUpdating}
                                className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
                            >
                                <Save className="h-4 w-4 mr-2 inline" />
                                {isUpdating ? "Saving..." : "Save Services"}
                            </button>
                        </div>
                    </div>
                );
            case 'availability':
                return (
                    <div className="p-6 bg-white space-y-6">
                        <div className="space-y-4">
                            {days.map((day) => {
                                const slot = formData.availability.find(s => s.day === day);
                                return (
                                    <div key={day} className="border rounded-lg p-4" style={{ borderColor: '#E5FFDB' }}>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-[#109C3D]"></div>
                                                <span className="font-medium text-[#063A41]">{day}</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${slot ? 'bg-[#109C3D] text-white' : 'bg-[#E5FFDB] text-[#063A41]'}`}>
                                                {slot ? `${slot.from} - ${slot.to}` : "Not Set"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label htmlFor={`${day}-from`} className="block text-sm font-medium text-[#063A41] mb-2">From</label>
                                                <select
                                                    id={`${day}-from`}
                                                    value={slot?.from || ""}
                                                    onChange={(e) => handleAvailabilityChange(day, "from", e.target.value)}
                                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                                    style={{ borderColor: '#063A41' }}
                                                >
                                                    <option value="">Select start time</option>
                                                    {timeOptions.map((time) => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor={`${day}-to`} className="block text-sm font-medium text-[#063A41] mb-2">To</label>
                                                <select
                                                    id={`${day}-to`}
                                                    value={slot?.to || ""}
                                                    onChange={(e) => handleAvailabilityChange(day, "to", e.target.value)}
                                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                                    style={{ borderColor: '#063A41' }}
                                                >
                                                    <option value="">Select end time</option>
                                                    {timeOptions.map((time) => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {slot && (
                                            <button
                                                onClick={() => removeAvailability(day)}
                                                className="w-full p-2 border text-[#063A41] rounded-lg hover:bg-[#E5FFDB] hover:text-[#063A41] transition-all"
                                                style={{ borderColor: '#063A41' }}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2 inline" />
                                                Remove {day} Availability
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
                            <button
                                onClick={handleSaveAvailability}
                                disabled={isUpdating}
                                className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
                            >
                                <Save className="h-4 w-4 mr-2 inline" />
                                {isUpdating ? "Saving..." : "Save Availability"}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#063A41' }}></div>
            </div>
        );
    }

    if (!userDetails || !userDetails.user) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-[#063A41]">Loading user details...</p>
            </div>
        );
    }

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#063A41] to-[#109C3D] bg-clip-text text-transparent mb-2">
                        My Services & Profile
                    </h1>
                    <p className="text-[#063A41]">Manage your professional profile, offerings, and schedule to attract more clients.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    className={`w-full justify-start space-x-3 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${isActive ? 'bg-[#E5FFDB] text-[#063A41] shadow-lg border-2' : 'bg-white text-gray-500 hover:bg-[#E5FFDB] hover:text-[#063A41] hover:shadow-md border border-gray-200'} border-0`}
                                    style={isActive ? { borderColor: '#109C3D' } : {}}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <Icon className={`h-5 w-5 ${isActive ? 'text-[#109C3D]' : 'text-gray-400'}`} />
                                    <span className="text-left font-medium">{section.title}</span>
                                    {isActive && <ChevronRight className="h-5 w-5 ml-auto inline text-[#109C3D]" />}
                                </button>
                            );
                        })}
                    </div>
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden border" style={{ borderColor: '#E5FFDB' }}>
                            <div className="p-6 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white shadow-lg">
                                <h2 className="flex items-center gap-3 text-white font-bold text-xl">
                                    {sections.find(s => s.id === activeSection)?.title}
                                </h2>
                                <p className="mt-2 opacity-90">
                                    {activeSection === 'profile' && 'Update your experience, skills, categories, and service areas to attract clients.'}
                                    {activeSection === 'services' && 'Add and manage the services you provide to showcase your expertise.'}
                                    {activeSection === 'availability' && 'Set your weekly schedule to let clients know when you\'re available.'}
                                </p>
                            </div>
                            {renderSectionContent()}
                        </div>
                    </div>
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
                    <DialogContent className="max-w-2xl p-0">
                        <DialogHeader className="p-6 border-b" style={{ borderColor: '#E5FFDB' }}>
                            <DialogTitle className="flex items-center gap-2 text-[#063A41]">
                                {isEditServiceOpen ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                {isEditServiceOpen ? "Edit Service" : "Add New Service"}
                            </DialogTitle>
                            <DialogDescription className="text-[#063A41]">
                                {isEditServiceOpen ? "Update the details of your service." : "Fill in the details for your new service."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-[#063A41] mb-2">Service Title</label>
                                    <select
                                        id="title"
                                        name="title"
                                        value={useCustomTitle ? "custom" : newService.title}
                                        onChange={handleNewServiceChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                        style={{ borderColor: '#063A41' }}
                                    >
                                        <option value="">Select a service type</option>
                                        {categoryOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                        <option value="custom">Custom Service...</option>
                                    </select>
                                    {useCustomTitle && (
                                        <input
                                            id="custom-title"
                                            name="title"
                                            placeholder="Enter custom service title"
                                            value={newService.title}
                                            onChange={handleNewServiceChange}
                                            className="mt-3 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                            style={{ borderColor: '#063A41' }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-[#063A41] mb-2">Hourly Rate ($)</label>
                                    <input
                                        id="hourlyRate"
                                        type="number"
                                        name="hourlyRate"
                                        placeholder="Enter hourly rate"
                                        value={newService.hourlyRate}
                                        onChange={handleNewServiceChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                        style={{ borderColor: '#063A41' }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-[#063A41] mb-2">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your service in detail..."
                                        value={newService.description}
                                        onChange={handleNewServiceChange}
                                        rows={4}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all"
                                        style={{ borderColor: '#063A41' }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="estimatedDuration" className="block text-sm font-medium text-[#063A41] mb-2">Estimated Duration</label>
                                    <input
                                        id="estimatedDuration"
                                        name="estimatedDuration"
                                        placeholder="e.g., 2 hours"
                                        value={newService.estimatedDuration}
                                        onChange={handleNewServiceChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                        style={{ borderColor: '#063A41' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="p-6 border-t bg-[#E5FFDB] rounded-b-lg" style={{ borderColor: '#E5FFDB' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    resetNewService();
                                    setIsAddServiceOpen(false);
                                    setIsEditServiceOpen(false);
                                    setEditingService(null);
                                }}
                                className="px-6 py-2 border text-[#063A41] rounded-lg hover:bg-[#E5FFDB] transition-all"
                                style={{ borderColor: '#063A41' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOrUpdateService}
                                className="px-6 py-2 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-md transition-all"
                            >
                                <Save className="h-4 w-4 mr-2 inline" />
                                {isEditServiceOpen ? "Update Service" : "Add Service"}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default MyServices;