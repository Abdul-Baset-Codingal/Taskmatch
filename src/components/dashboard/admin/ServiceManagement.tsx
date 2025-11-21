/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import {
    useGetServicesQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} from '@/features/api/servicesApi';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { HiX } from 'react-icons/hi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

type PopularOption = {
    name: string;
    price: number;
    details: string[];
    label?: string;
};

type Addon = {
    name: string;
    price: number;
};

type Package = {
    name: string;
    icon?: string;
    title?: string;
    price: number;
    description?: string;
    features: string[];
};

type ServiceFormData = {
    slug: string;
    title: string;
    category: string;
    description: string;
    basePrice: number | string;
    tags: string[];
    popularOptions: PopularOption[];
    addons: Addon[];
    inputFields: string[];
    photos: string[];
    packages: Package[];
};

const initialState: ServiceFormData = {
    slug: '',
    title: '',
    category: '',
    description: '',
    basePrice: '',
    tags: [],
    popularOptions: [],
    addons: [],
    inputFields: [],
    photos: [],
    packages: [],
};

// Validate MongoDB ObjectId (24-character hexadecimal string)
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

const ServiceManagement = () => {
    const { data: services, isLoading, refetch } = useGetServicesQuery({});
    const [createService] = useCreateServiceMutation();
    const [updateService] = useUpdateServiceMutation();
    const [deleteService] = useDeleteServiceMutation();

    const [formData, setFormData] = useState(initialState);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'tags' || name === 'inputFields') {
            setFormData({ ...formData, [name]: value.split(',').map((v: string) => v.trim()).filter(Boolean) });
        } else if (name === 'basePrice') {
            setFormData({ ...formData, [name]: value === '' ? '' : parseFloat(value) || 0 });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const API_KEY = '8b35d4601167f12207fbc7c8117f897e';
        const urls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            try {
                const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                    method: 'POST',
                    body: uploadFormData,
                });
                const data = await res.json();
                if (data.success) {
                    urls.push(data.data.url);
                } else {
                    toast.error('Upload failed for one or more images');
                }
            } catch (err) {
                console.error('Upload error:', err);
                toast.error('Upload error occurred');
            }
        }
        setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...urls],
        }));
    };

    const handleRemovePhoto = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            photos: prev.photos?.filter((_, i) => i !== index) || [],
        }));
    };

    const handlePopularOptionChange = (index: number, field: keyof PopularOption, value: string) => {
        setFormData((prev) => {
            const updated = [...prev.popularOptions];
            const updatedOption = { ...updated[index] };
            if (field === 'details') {
                updatedOption.details = value.split(',').map((v) => v.trim()).filter(Boolean);
            } else if (field === 'price') {
                updatedOption.price = value === '' ? 0 : parseFloat(value) || 0;
            } else {
                updatedOption[field] = value;
            }
            updated[index] = updatedOption;
            return { ...prev, popularOptions: updated };
        });
    };

    const removePopularOption = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            popularOptions: prev.popularOptions.filter((_, i) => i !== index),
        }));
    };

    const addPopularOption = () => {
        setFormData((prev) => ({
            ...prev,
            popularOptions: [...prev.popularOptions, { name: '', price: 0, details: [], label: '' }],
        }));
    };

    const handleAddonChange = (index: number, field: keyof Addon, value: string) => {
        setFormData((prev) => {
            const updated = [...prev.addons];
            const updatedAddon = { ...updated[index] };
            if (field === 'price') {
                updatedAddon.price = value === '' ? 0 : parseFloat(value) || 0;
            } else {
                updatedAddon[field] = value;
            }
            updated[index] = updatedAddon;
            return { ...prev, addons: updated };
        });
    };

    const removeAddon = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            addons: prev.addons.filter((_, i) => i !== index),
        }));
    };

    const addAddon = () => {
        setFormData((prev) => ({
            ...prev,
            addons: [...prev.addons, { name: '', price: 0 }],
        }));
    };

    const handlePackageChange = (index: number, field: keyof Package | 'features', value: string) => {
        setFormData((prev) => {
            const updated = [...prev.packages];
            const pkg = { ...updated[index] };
            if (field === 'price') {
                pkg.price = value === '' ? 0 : parseFloat(value) || 0;
            } else if (field === 'features') {
                pkg.features = value.split(',').map((f) => f.trim()).filter(Boolean);
            } else {
                pkg[field] = value;
            }
            updated[index] = pkg;
            return { ...prev, packages: updated };
        });
    };

    const removePackage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            packages: prev.packages.filter((_, i) => i !== index),
        }));
    };

    const addPackage = () => {
        setFormData((prev) => ({
            ...prev,
            packages: [...prev.packages, { name: '', icon: '', title: '', price: 0, description: '', features: [] }],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            toast.error('Please enter a password!');
            return;
        }
        setIsSubmitting(true);
        try {
            if (editMode && editingId) {
                if (!isValidObjectId(editingId)) {
                    toast.error('Invalid service ID!');
                    return;
                }
                await updateService({ id: editingId, ...formData, password }).unwrap();
                toast.success('Service updated successfully!');
                refetch();
                resetForm();
            } else {
                await createService({ ...formData, password }).unwrap();
                toast.success('Service created successfully!');
                refetch();
                resetForm();
            }
        } catch (error: any) {
            toast.error(error?.data?.error || 'Operation failed!');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData(initialState);
        setEditMode(false);
        setEditingId(null);
        setPassword('');
    };

    const handleEdit = (service: any) => {
        if (!isValidObjectId(service._id)) {
            toast.error('Invalid service ID!');
            return;
        }
        const filledPopularOptions = (service.popularOptions || []).map((opt: any) => ({
            ...opt,
            details: opt.details || []
        }));
        const filledPackages = (service.packages || []).map((pkg: any) => ({
            ...pkg,
            features: pkg.features || []
        }));
        const filledService = {
            ...initialState,
            slug: service.slug || service.id || '',
            title: service.title || '',
            category: service.category || '',
            description: service.description || '',
            basePrice: service.basePrice || '',
            tags: service.tags || [],
            inputFields: service.inputFields || [],
            popularOptions: filledPopularOptions,
            addons: service.addons || [],
            photos: service.photos || [],
            packages: filledPackages,
        };
        setFormData(filledService);
        setEditMode(true);
        setEditingId(service._id);
        setShowPassword(false);
    };

    const handleDelete = async (id: string) => {
        if (!isValidObjectId(id)) {
            toast.error('Invalid service ID!');
            return;
        }

        if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            try {
                await deleteService(id).unwrap();
                toast.success('Service deleted successfully!');
                refetch();
            } catch (error) {
                const err = error as any;
                toast.error(err?.data?.error || 'Failed to delete service!');
                console.error(err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-color3 via-white to-color3/50 flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <FaSpinner className="animate-spin text-4xl text-color1 mx-auto" />
                    <p className="text-xl text-gray-600 font-medium">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-color3 via-white to-color3/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text1 mb-4">🛠️ Service Management</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Create, edit, and manage your services with ease. Add photos, options, and packages to enhance your offerings.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-12">
                    <div className="p-8 lg:p-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text1">
                                {editMode ? '✏️ Edit Service' : '➕ Create New Service'}
                            </h2>
                            {editMode && (
                                <button
                                    onClick={resetForm}
                                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition"
                                >
                                    <FaTimes className="w-4 h-4" /> Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Service Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Enter service title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-color2 focus:ring-4 focus:ring-color2/10 transition-all bg-gray-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Category *</label>
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="e.g., Plumbing, Web Development"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-color2 focus:ring-4 focus:ring-color2/10 transition-all bg-gray-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Base Price ($)*</label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        placeholder="0.00"
                                        value={formData.basePrice}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-color2 focus:ring-4 focus:ring-color2/10 transition-all bg-gray-50"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* Admin Password */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Admin Password *</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-200 focus:border-color2 focus:ring-4 focus:ring-color2/10 transition-all bg-gray-50"
                                    placeholder="Enter admin password for verification"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-[3.25rem] right-4 text-gray-500 hover:text-gray-700 transition"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>

                            {/* Photos Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Photos</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-color1 file:to-color2 file:text-white file:font-semibold hover:file:from-color1/90 hover:file:to-color2/90 transition cursor-pointer"
                                />
                                {formData.photos.length > 0 && (
                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {formData.photos.map((url, idx) => (
                                            <div key={idx} className="relative group rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-color2 transition">
                                                <Image
                                                    src={url as string}
                                                    alt={`Photo ${idx + 1}`}
                                                    width={150}
                                                    height={150}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(idx)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <HiX size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Description *</label>
                                <textarea
                                    name="description"
                                    placeholder="Provide a detailed description of the service..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-color2 focus:ring-4 focus:ring-color2/10 transition-all resize-vertical bg-gray-50"
                                    required
                                />
                            </div>

                            {/* Tags & Input Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        placeholder="e.g., urgent, residential, commercial"
                                        value={formData.tags.join(', ')}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-color2 focus:ring-4 focus:ring-color2/10 transition-all bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Input Fields (comma separated)</label>
                                    <input
                                        type="text"
                                        name="inputFields"
                                        placeholder="e.g., address, preferred date, special instructions"
                                        value={formData.inputFields.join(', ')}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-color2 focus:ring-4 focus:ring-color2/10 transition-all bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Dynamic Sections */}
                            <div className="space-y-6">
                                {/* Popular Options */}
                                <div className="border-l-4 border-color1 pl-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text1">🔥 Popular Options</h4>
                                        <button
                                            type="button"
                                            onClick={addPopularOption}
                                            className="flex items-center gap-2 px-4 py-2 bg-color1/10 text-color1 hover:bg-color1/20 rounded-xl font-medium transition"
                                        >
                                            <FaPlus className="w-4 h-4" /> Add
                                        </button>
                                    </div>
                                    {formData.popularOptions.length === 0 ? (
                                        <p className="text-gray-500 italic text-center py-8">No popular options. Add some to highlight key features!</p>
                                    ) : (
                                        formData.popularOptions.map((opt, index) => (
                                            <div key={index} className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h5 className="font-semibold text-gray-800">Option {index + 1}</h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePopularOption(index)}
                                                        className="text-red-500 hover:text-red-600 transition"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Option Name"
                                                        value={opt.name}
                                                        onChange={(e) => handlePopularOptionChange(index, 'name', e.target.value)}
                                                        className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-color1"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Price ($)"
                                                        value={opt.price}
                                                        onChange={(e) => handlePopularOptionChange(index, 'price', e.target.value)}
                                                        className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-color1"
                                                        min="0"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Details (comma separated)"
                                                        value={opt.details.join(', ')}
                                                        onChange={(e) => handlePopularOptionChange(index, 'details', e.target.value)}
                                                        className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-color1"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Label (e.g., Popular)"
                                                        value={opt.label || ''}
                                                        onChange={(e) => handlePopularOptionChange(index, 'label', e.target.value)}
                                                        className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-color1"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Addons */}
                                <div className="border-l-4 border-color2 pl-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text1">➕ Addons</h4>
                                        <button
                                            type="button"
                                            onClick={addAddon}
                                            className="flex items-center gap-2 px-4 py-2 bg-color2/10 text-color2 hover:bg-color2/20 rounded-xl font-medium transition"
                                        >
                                            <FaPlus className="w-4 h-4" /> Add
                                        </button>
                                    </div>
                                    {formData.addons.length === 0 ? (
                                        <p className="text-gray-500 italic text-center py-8">No addons. Add extras to upsell!</p>
                                    ) : (
                                        formData.addons.map((addon, index) => (
                                            <div key={index} className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h5 className="font-semibold text-gray-800">Addon {index + 1}</h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAddon(index)}
                                                        className="text-red-500 hover:text-red-600 transition"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Addon Name"
                                                        value={addon.name}
                                                        onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                                                        className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-color2"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Price ($)"
                                                        value={addon.price}
                                                        onChange={(e) => handleAddonChange(index, 'price', e.target.value)}
                                                        className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-color2"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Packages */}
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text1">📦 Packages</h4>
                                        <button
                                            type="button"
                                            onClick={addPackage}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 rounded-xl font-medium transition"
                                        >
                                            <FaPlus className="w-4 h-4" /> Add
                                        </button>
                                    </div>
                                    {formData.packages.length === 0 ? (
                                        <p className="text-gray-500 italic text-center py-8">No packages. Create tiered pricing!</p>
                                    ) : (
                                        formData.packages.map((pkg, index) => (
                                            <div key={index} className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h5 className="font-semibold text-gray-800">Package {index + 1}</h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePackage(index)}
                                                        className="text-red-500 hover:text-red-600 transition"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Package Name"
                                                            value={pkg.name}
                                                            onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                                                            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Icon (emoji)"
                                                            value={pkg.icon || ''}
                                                            onChange={(e) => handlePackageChange(index, 'icon', e.target.value)}
                                                            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Title"
                                                            value={pkg.title || ''}
                                                            onChange={(e) => handlePackageChange(index, 'title', e.target.value)}
                                                            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Price ($)"
                                                            value={pkg.price}
                                                            onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                                                            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Description"
                                                        value={pkg.description || ''}
                                                        onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                                                        className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Features (comma separated)"
                                                        value={(pkg.features || []).join(', ')}
                                                        onChange={(e) => handlePackageChange(index, 'features', e.target.value)}
                                                        className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 px-8 color1 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin w-5 h-5" />
                                            {editMode ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit className="w-5 h-5" />
                                            {editMode ? 'Update Service' : 'Create Service'}
                                        </>
                                    )}
                                </button>
                                {editMode && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="py-4 px-8 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition flex items-center justify-center gap-3 text-lg"
                                    >
                                        <FaTimes className="w-5 h-5" /> Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="space-y-6">
                    <h3 className="text-3xl font-bold text1 flex items-center gap-3">
                        📋 All Services
                        <span className="text-lg text-gray-600 font-normal">({services?.length || 0})</span>
                    </h3>
                    {services?.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-white/50">
                            <FaPlus className="mx-auto text-6xl text-color3 mb-4" />
                            <h4 className="text-2xl font-semibold text-gray-600 mb-2">No Services Yet</h4>
                            <p className="text-gray-500 mb-6">Get started by creating your first service above.</p>
                            <button
                                onClick={() => setEditMode(false)}
                                className="py-3 px-8 bg-color1 text-white rounded-2xl font-semibold hover:bg-opacity-90 transition"
                            >
                                Create First Service
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services?.map((service: any) => (
                                <div key={service._id} className="bg-white rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                                    {/* Image Section */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-color3 to-white">
                                        {service.photos?.[0] ? (
                                            <Image
                                                src={service.photos[0] as string}
                                                alt={service.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <FaPlus className="w-12 h-12" />
                                            </div>
                                        )}
                                        {service.photos?.length > 1 && (
                                            <div className="absolute top-3 right-3 bg-color1 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                +{service.photos.length - 1}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h4 className="text-xl font-bold text1 mb-2 line-clamp-1">{service.title}</h4>
                                            <p className="text-gray-600 line-clamp-2">{service.description}</p>
                                        </div>

                                        {/* Quick Info */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="space-y-1">
                                                <span className="text-gray-500 text-xs uppercase tracking-wide">Category</span>
                                                <span className="font-semibold text-gray-900">{service.category}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-gray-500 text-xs uppercase tracking-wide">Base Price</span>
                                                <span className="font-bold text2">${service.basePrice}</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {service.tags?.length > 0 && (
                                            <div className="space-y-1">
                                                <span className="text-gray-500 text-xs uppercase tracking-wide">Tags</span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {service.tags.map((tag: string) => (
                                                        <span key={tag} className="px-3 py-1 bg-gradient-to-r from-color3 to-color3/50 text-color1 text-xs rounded-full font-medium">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Popular Options Preview */}
                                        {service.popularOptions?.length > 0 && (
                                            <div className="pt-4 border-t border-gray-100">
                                                <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                    🔥 Popular Options
                                                    <span className="text-xs text-gray-500">({service.popularOptions.length})</span>
                                                </h5>
                                                <div className="space-y-1 text-sm">
                                                    {service.popularOptions.slice(0, 2).map((opt: any) => (
                                                        <div key={opt.name} className="flex justify-between">
                                                            <span className="text-gray-600 truncate">{opt.name}</span>
                                                            <span className="font-medium text2">${opt.price}</span>
                                                        </div>
                                                    ))}
                                                    {service.popularOptions.length > 2 && (
                                                        <p className="text-xs text-gray-500">+{service.popularOptions.length - 2} more</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="p-6 pt-0 flex gap-3 bg-gray-50">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="flex-1 py-3 px-6 color1 text-white rounded-xl font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2 shadow-md"
                                        >
                                            <FaEdit className="w-4 h-4" /> Edit Service
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="flex-1 py-3 px-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 shadow-md"
                                        >
                                            <FaTrash className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceManagement;