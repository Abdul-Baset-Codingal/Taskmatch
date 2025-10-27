/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/features/auth/authApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Save, Calendar, DollarSign, Clock as ClockIcon, User, MapPin, Wrench } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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

    // Predefined service category options for categories and services
    const categoryOptions = [
        "Handyman",
        "Renovation & Moving Help",
        "Pet Services",
        "Complete Cleaning",
        "Plumbing, Electrical & HVAC (PEH)",
        "Beauty & Wellness",
        "Everything Else",
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
    });

    // Populate formData with userDetails
    useEffect(() => {
        if (userDetails && user?._id) {
            setFormData({
                services: userDetails.services || [],
                availability: userDetails.availability || [],
                yearsOfExperience: userDetails.yearsOfExperience || "",
                skills: userDetails.skills || [],
                categories: userDetails.categories || [],
                serviceAreas: userDetails.serviceAreas || [],
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
        if (name === "title" && value === "custom") {
            setUseCustomTitle(true);
            return;
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
        setFormData({ ...formData, availability: newAvailability.filter(s => s.from && s.to) });
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

    const handleSaveChanges = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        try {
            await updateUser({
                userId: user._id,
                services: formData.services,
                availability: formData.availability,
                yearsOfExperience: formData.yearsOfExperience,
                skills: formData.skills,
                categories: formData.categories,
                serviceAreas: formData.serviceAreas,
            }).unwrap();
            await refetch();
            toast.success("Services and profile updated successfully!");
        } catch (err: any) {
            console.error("Failed to update:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    My Services & Profile
                </h1>
                <p className="text-slate-600">Manage your professional profile, offerings, and schedule to attract more clients.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Professional Profile Section */}
                <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-purple-800">
                            <User className="h-6 w-6" />
                            Professional Profile
                        </CardTitle>
                        <CardDescription className="text-purple-600">
                            Update your experience, skills, categories, and service areas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {/* Years of Experience */}
                        <div className="space-y-2">
                            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-slate-700">
                                Years of Experience
                            </label>
                            <Input
                                id="yearsOfExperience"
                                type="text"
                                placeholder="e.g., 5+ years"
                                value={formData.yearsOfExperience}
                                onChange={handleYearsOfExperienceChange}
                                className="w-full"
                            />
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Add a skill (e.g., Painting, Wiring)"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddSkill}
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1 bg-blue-100 text-blue-800"
                                    >
                                        {skill}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSkill(skill)}
                                            className="h-4 w-4 p-0 ml-1"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Service Categories */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700">Service Categories</label>
                            <div className="space-y-2">
                                {categoryOptions.map((category) => (
                                    <div key={category} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${category}`}
                                            checked={formData.categories.includes(category)}
                                            onCheckedChange={() => handleCategoryToggle(category)}
                                        />
                                        <label htmlFor={`category-${category}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Service Areas */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Add a service area (e.g., Toronto, M5V 2T6)"
                                    value={newServiceArea}
                                    onChange={(e) => setNewServiceArea(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddServiceArea()}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddServiceArea}
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.serviceAreas.map((area, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1 bg-green-100 text-green-800"
                                    >
                                        <MapPin className="h-3 w-3" />
                                        {area}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeServiceArea(area)}
                                            className="h-4 w-4 p-0 ml-1"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Services Section */}
                <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-blue-800">
                            <Wrench className="h-6 w-6" />
                            My Services
                        </CardTitle>
                        <CardDescription className="text-blue-600">
                            Add and manage the services you provide.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-6">
                            <Button
                                onClick={() => {
                                    resetNewService();
                                    setIsAddServiceOpen(true);
                                }}
                                className="w-full mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Service
                            </Button>

                            <div className="space-y-4">
                                {formData.services.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ClockIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-500">No services added yet. Start by adding one above!</p>
                                    </div>
                                ) : (
                                    formData.services.map((service, index) => (
                                        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-lg text-slate-800 mb-2">{service.title}</h4>
                                                        <p className="text-slate-600 mb-3 line-clamp-2">{service.description}</p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                                                                <DollarSign className="h-3 w-3" />
                                                                ${service.hourlyRate}/hr
                                                            </Badge>
                                                            <Badge variant="outline" className="flex items-center gap-1">
                                                                <ClockIcon className="h-3 w-3" />
                                                                {service.estimatedDuration}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => startEditingService(index)}
                                                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeService(index)}
                                                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Availability Section */}
                <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-emerald-800">
                            <Calendar className="h-6 w-6" />
                            My Availability
                        </CardTitle>
                        <CardDescription className="text-emerald-600">
                            Set your weekly schedule to let clients know when you're available.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Accordion type="multiple" className="w-full">
                            {days.map((day) => {
                                const slot = formData.availability.find(s => s.day === day);
                                return (
                                    <AccordionItem key={day} value={day} className="border-b last:border-b-0">
                                        <AccordionTrigger className="hover:no-underline px-0 py-4">
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <span className="font-medium text-slate-800">{day}</span>
                                                </div>
                                                <Badge variant={slot ? "default" : "secondary"} className={slot ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"}>
                                                    {slot ? `${slot.from} - ${slot.to}` : "Not Set"}
                                                </Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label htmlFor={`${day}-from`} className="block text-sm font-medium text-slate-700 mb-2">From</label>
                                                    <select
                                                        id={`${day}-from`}
                                                        value={slot?.from || ""}
                                                        onChange={(e) => handleAvailabilityChange(day, "from", e.target.value)}
                                                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    >
                                                        <option value="">Select start time</option>
                                                        {timeOptions.map((time) => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor={`${day}-to`} className="block text-sm font-medium text-slate-700 mb-2">To</label>
                                                    <select
                                                        id={`${day}-to`}
                                                        value={slot?.to || ""}
                                                        onChange={(e) => handleAvailabilityChange(day, "to", e.target.value)}
                                                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    >
                                                        <option value="">Select end time</option>
                                                        {timeOptions.map((time) => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {slot && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeAvailability(day)}
                                                    className="text-red-600 hover:text-red-800 border-red-300 hover:bg-red-50 w-full"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remove {day} Availability
                                                </Button>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-center mt-12">
                <Button
                    onClick={handleSaveChanges}
                    disabled={isUpdating}
                    size="lg"
                    className="px-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                >
                    <Save className="h-5 w-5 mr-2" />
                    {isUpdating ? "Saving Changes..." : "Save All Changes"}
                </Button>
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
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="flex items-center gap-2">
                            {isEditServiceOpen ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            {isEditServiceOpen ? "Edit Service" : "Add New Service"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditServiceOpen ? "Update the details of your service." : "Fill in the details for your new service."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">Service Title</label>
                                <select
                                    id="title"
                                    name="title"
                                    value={newService.title}
                                    onChange={handleNewServiceChange}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select a service type</option>
                                    {categoryOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                    <option value="custom">Custom Service...</option>
                                </select>
                                {useCustomTitle && (
                                    <Input
                                        id="custom-title"
                                        name="title"
                                        placeholder="Enter custom service title"
                                        value={newService.title}
                                        onChange={handleNewServiceChange}
                                        className="mt-3"
                                    />
                                )}
                            </div>
                            <div>
                                <label htmlFor="hourlyRate" className="block text-sm font-medium text-slate-700 mb-2">Hourly Rate ($)</label>
                                <Input
                                    id="hourlyRate"
                                    type="number"
                                    name="hourlyRate"
                                    placeholder="Enter hourly rate"
                                    value={newService.hourlyRate}
                                    onChange={handleNewServiceChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe your service in detail..."
                                    value={newService.description}
                                    onChange={handleNewServiceChange}
                                    rows={4}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="estimatedDuration" className="block text-sm font-medium text-slate-700 mb-2">Estimated Duration</label>
                                <Input
                                    id="estimatedDuration"
                                    name="estimatedDuration"
                                    placeholder="e.g., 2 hours"
                                    value={newService.estimatedDuration}
                                    onChange={handleNewServiceChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-6 border-t bg-slate-50 rounded-b-lg">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                resetNewService();
                                setIsAddServiceOpen(false);
                                setIsEditServiceOpen(false);
                                setEditingService(null);
                            }}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddOrUpdateService}
                            className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isEditServiceOpen ? "Update Service" : "Add Service"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyServices;