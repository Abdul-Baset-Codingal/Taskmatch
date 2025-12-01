/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from 'react-icons/fa';

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
    const [isUploading, setIsUploading] = useState(false);

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

    // Improved Image Handling
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const API_KEY = '8b35d4601167f12207fbc7c8117f897e';
        const newPhotos: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const uploadFormData = new FormData();
                uploadFormData.append('image', file);

                const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                    method: 'POST',
                    body: uploadFormData,
                });

                const data = await res.json();
                if (data.success) {
                    newPhotos.push(data.data.url);
                } else {
                    toast.error(`Failed to upload: ${file.name}`);
                }
            }

            if (newPhotos.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    photos: [...prev.photos, ...newPhotos],
                }));
                toast.success(`Successfully uploaded ${newPhotos.length} image(s)`);
            }
        } catch (err) {
            console.error('Upload error:', err);
            toast.error('Upload error occurred');
        } finally {
            setIsUploading(false);
            // Clear the file input
            e.target.value = '';
        }
    };

    const handleRemovePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
    };

    const handleReplacePhoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const API_KEY = '8b35d4601167f12207fbc7c8117f897e';

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                method: 'POST',
                body: uploadFormData,
            });

            const data = await res.json();
            if (data.success) {
                const newPhotos = [...formData.photos];
                newPhotos[index] = data.data.url;
                setFormData(prev => ({ ...prev, photos: newPhotos }));
                toast.success('Image replaced successfully');
            } else {
                toast.error('Failed to replace image');
            }
        } catch (err) {
            console.error('Upload error:', err);
            toast.error('Error replacing image');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const clearAllPhotos = () => {
        setFormData(prev => ({ ...prev, photos: [] }));
    };

    // Simplified dynamic field handlers
    const handleArrayField = (field: keyof ServiceFormData, index: number, value: any) => {
        setFormData(prev => {
            const updated = [...(prev[field] as any[])];
            updated[index] = { ...updated[index], ...value };
            return { ...prev, [field]: updated };
        });
    };

    const addArrayField = (field: keyof ServiceFormData, defaultValue: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as any[]), defaultValue],
        }));
    };

    const removeArrayField = (field: keyof ServiceFormData, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as any[]).filter((_, i) => i !== index),
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
            const serviceData = { ...formData, password };

            if (editMode && editingId) {
                await updateService({ id: editingId, ...serviceData }).unwrap();
                toast.success('Service updated successfully!');
            } else {
                await createService(serviceData).unwrap();
                toast.success('Service created successfully!');
            }

            refetch();
            resetForm();
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
        setFormData({
            ...initialState,
            slug: service.slug || '',
            title: service.title || '',
            category: service.category || '',
            description: service.description || '',
            basePrice: service.basePrice || '',
            tags: service.tags || [],
            inputFields: service.inputFields || [],
            popularOptions: service.popularOptions?.map((opt: any) => ({
                ...opt,
                details: opt.details || []
            })) || [],
            addons: service.addons || [],
            photos: service.photos || [],
            packages: service.packages?.map((pkg: any) => ({
                ...pkg,
                features: pkg.features || []
            })) || [],
        });
        setEditMode(true);
        setEditingId(service._id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            try {
                await deleteService(id).unwrap();
                toast.success('Service deleted successfully!');
                refetch();
            } catch (error: any) {
                toast.error(error?.data?.error || 'Failed to delete service!');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" />
                    <p className="text-xl text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
                    <p className="text-gray-600">Create and manage your services</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border mb-8">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                {editMode ? 'Edit Service' : 'Create New Service'}
                            </h2>
                            {editMode && (
                                <button
                                    onClick={resetForm}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Service Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Base Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admin Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-500"
                                        >
                                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Improved Image Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Service Photos {formData.photos.length > 0 && `(${formData.photos.length})`}
                                </label>

                                {/* Current Photos Grid */}
                                {formData.photos.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-600">Current photos:</span>
                                            <button
                                                type="button"
                                                onClick={clearAllPhotos}
                                                className="text-sm text-red-600 hover:text-red-700"
                                            >
                                                Remove All
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {formData.photos.map((url, index) => (
                                                <div key={index} className="relative group border rounded-lg overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={url}
                                                        alt={`Service photo ${index + 1}`}
                                                        width={200}
                                                        height={150}
                                                        className="w-full h-32 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <div className="flex gap-2">
                                                            <label className="cursor-pointer bg-white p-2 rounded-lg hover:bg-gray-100 transition">
                                                                <FaEdit className="w-4 h-4 text-blue-600" />
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleReplacePhoto(index, e)}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemovePhoto(index)}
                                                                className="bg-white p-2 rounded-lg hover:bg-gray-100 transition"
                                                            >
                                                                <HiX className="w-4 h-4 text-red-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload New Photos */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {isUploading ? (
                                        <div className="flex items-center justify-center gap-3 text-gray-600">
                                            <FaSpinner className="animate-spin" />
                                            Uploading images...
                                        </div>
                                    ) : (
                                        <>
                                            <FaImage className="mx-auto text-3xl text-gray-400 mb-3" />
                                            <p className="text-gray-600 mb-3">Upload service photos</p>
                                            <label className="cursor-pointer color1 text-white px-4 py-2 rounded-lg  transition inline-block">
                                                Choose Files
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handlePhotoUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags.join(', ')}
                                        onChange={handleChange}
                                        placeholder="urgent, residential, commercial"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Input Fields (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="inputFields"
                                        value={formData.inputFields.join(', ')}
                                        onChange={handleChange}
                                        placeholder="address, date, instructions"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 color1 text-white py-3 px-6 rounded-lg font-semibold  disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            {editMode ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit />
                                            {editMode ? 'Update Service' : 'Create Service'}
                                        </>
                                    )}
                                </button>
                                {editMode && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Services List */}
                <div>
                    <h3 className="text-2xl font-semibold mb-6">
                        All Services ({services?.length || 0})
                    </h3>

                    {services?.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border">
                            <FaPlus className="mx-auto text-4xl text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">No services yet</p>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Create First Service
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services?.map((service: any) => (
                                <div key={service._id} className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition">
                                    {/* Service Image */}
                                    <div className="h-48 bg-gray-200 relative">
                                        {service.photos?.[0] ? (
                                            <Image
                                                src={service.photos[0]}
                                                alt={service.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <FaImage className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Service Info */}
                                    <div className="p-4">
                                        <h4 className="font-semibold text-lg mb-2">{service.title}</h4>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">{service.category}</span>
                                            <span className="font-semibold">${service.basePrice}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="flex-1 color1 text-white py-2 rounded flex items-center justify-center gap-2"
                                            >
                                                <FaEdit className="w-3 h-3" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service._id)}
                                                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
                                            >
                                                <FaTrash className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
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