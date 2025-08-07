/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    useGetServicesQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} from '@/features/api/servicesApi';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { HiX } from 'react-icons/hi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

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
    const { data: services, isLoading } = useGetServicesQuery({});
    const [createService] = useCreateServiceMutation();
    const [updateService] = useUpdateServiceMutation();
    const [deleteService] = useDeleteServiceMutation();

    const [formData, setFormData] = useState(initialState);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        if (name === 'tags' || name === 'inputFields') {
            setFormData({ ...formData, [name]: value.split(',').map((v: string) => v.trim()) });
        } else if (name === 'basePrice') {
            setFormData({ ...formData, [name]: parseFloat(value) || '' });
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
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (data.success) {
                    urls.push(data.data.url);
                } else {
                    console.error('Upload failed:', data);
                }
            } catch (err) {
                console.error('Upload error:', err);
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
            photos: prev.photos?.filter((_, i) => i !== index),
        }));
    };

    const handlePopularOptionChange = (index: number, field: string, value: string) => {
        setFormData((prev) => {
            const updated = [...prev.popularOptions];
            const updatedOption = { ...updated[index] };
            if (field === 'details') {
                updatedOption.details = value.split(',').map((v) => v.trim());
            } else if (field === 'price') {
                updatedOption.price = parseFloat(value) || 0;
            } else {
                updatedOption[field as keyof PopularOption] = value as never;
            }
            updated[index] = updatedOption;
            return { ...prev, popularOptions: updated };
        });
    };

    const handleAddonChange = (index: number, field: string, value: string) => {
        setFormData((prev) => {
            const updated = [...prev.addons];
            const updatedAddon = { ...updated[index] };
            if (field === 'price') {
                updatedAddon.price = parseFloat(value) || 0;
            } else if (field === 'name') {
                updatedAddon.name = value;
            }
            updated[index] = updatedAddon;
            return { ...prev, addons: updated };
        });
    };

    const addPopularOption = () => {
        setFormData((prev) => ({
            ...prev,
            popularOptions: [...prev.popularOptions, { name: '', price: 0, details: [], label: '' }],
        }));
    };

    const addAddon = () => {
        setFormData((prev) => ({
            ...prev,
            addons: [...prev.addons, { name: '', price: 0 }],
        }));
    };

    const handlePackageChange = (index: number, field: string, value: string) => {
        setFormData((prev) => {
            const updated = [...prev.packages];
            const pkg = { ...updated[index] };
            if (field === 'price') {
                pkg.price = parseFloat(value) || 0;
            } else if (field === 'features') {
                pkg.features = value.split(',').map((f) => f.trim());
            } else {
                (pkg as any)[field] = value;
            }
            updated[index] = pkg;
            return { ...prev, packages: updated };
        });
    };

    const addPackage = () => {
        setFormData((prev) => ({
            ...prev,
            packages: [...prev.packages, { name: '', icon: '', title: '', price: 0, description: '', features: [] }],
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!password) {
            toast.error('Please enter a password!');
            return;
        }
        try {
            if (editMode && editingId) {
                if (!isValidObjectId(editingId)) {
                    toast.error('Invalid service ID!');
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const updatedService = await updateService({ id: editingId, ...formData, password }).unwrap();
                toast.success('Service updated successfully!');
                setFormData(initialState);
                setEditMode(false);
                setEditingId(null);
                setPassword('');
            } else {
                await createService({ ...formData, password }).unwrap();
                toast.success('Service created successfully!');
                setFormData(initialState);
                setPassword('');
            }
        } catch (error: any) {
            toast.error(error?.data?.error || 'Operation failed!');
            console.error(error);
        }
    };

    const handleEdit = (service: any) => {
        if (!isValidObjectId(service._id)) {
            toast.error('Invalid service ID!');
            return;
        }
        const filledService = {
            ...initialState,
            slug: service.slug || service.id || '',
            title: service.title || '',
            category: service.category || '',
            description: service.description || '',
            basePrice: service.basePrice || '',
            tags: service.tags || [],
            inputFields: service.inputFields || [],
            popularOptions: service.popularOptions || [],
            addons: service.addons || [],
            photos: service.photos || [],
            packages: service.packages || [],
        };
        setFormData(filledService);
        setEditMode(true);
        setEditingId(service._id);
    };

    const handleDelete = async (id: string) => {
        
        if (!isValidObjectId(id)) {
            toast.error('Invalid service ID!');
            return;
        }

        if (confirm('Are you sure to delete?')) {
            try {
                await deleteService(id).unwrap(); // ✅ pass only the ID
                toast.success('Service deleted successfully!');
            } catch (error) {
                const err = error as any;
                toast.error(err?.data?.error || 'Failed to delete service!');
                console.error(err);
            }

        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-pink-100 p-6">
            <div className="max-w-5xl mx-auto space-y-10">
                <h2 className="text-4xl font-bold text-center text-gray-800 drop-shadow-md">🛠️ Service Management</h2>

                <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-md bg-white/70 border border-white/40 shadow-xl p-8 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            type="number"
                            name="basePrice"
                            placeholder="Base Price"
                            value={formData.basePrice}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="admin-password" className="block text-sm mb-1 text-gray-900">
                            Admin Password
                        </label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                                placeholder="Enter admin password"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Upload Photos</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="block w-full p-2 rounded-xl border border-gray-300"
                        />
                        <div className="mt-3 flex gap-2 flex-wrap">
                            {formData.photos?.map((url, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-lg border overflow-hidden group">
                                    <Image
                                        src={url}
                                        alt={`Preview ${idx}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(idx)}
                                        className="absolute top-0 right-0 bg-black/60 text-white p-1 rounded-bl hover:bg-red-600 transition group-hover:opacity-100 opacity-0"
                                    >
                                        <HiX size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="text"
                        name="tags"
                        placeholder="Tags (comma separated)"
                        value={formData.tags.join(',')}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        name="inputFields"
                        placeholder="Input Fields (comma separated)"
                        value={formData.inputFields.join(',')}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div>
                        <h4 className="font-semibold text-lg mb-2">🔥 Popular Options</h4>
                        {formData.popularOptions.map((opt, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={opt.name}
                                    onChange={(e) => handlePopularOptionChange(index, 'name', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={opt.price}
                                    onChange={(e) => handlePopularOptionChange(index, 'price', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Details (comma)"
                                    value={opt.details?.join(',')}
                                    onChange={(e) => handlePopularOptionChange(index, 'details', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Label (optional)"
                                    value={opt.label || ''}
                                    onChange={(e) => handlePopularOptionChange(index, 'label', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addPopularOption} className="text-sm text-blue-600 hover:underline">
                            + Add Popular Option
                        </button>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-2">➕ Addons</h4>
                        {formData.addons.map((addon, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={addon.name}
                                    onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={addon.price}
                                    onChange={(e) => handleAddonChange(index, 'price', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addAddon} className="text-sm text-blue-600 hover:underline">
                            + Add Addon
                        </button>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-2">📦 Packages</h4>
                        {formData.packages.map((pkg, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <input
                                    type="text"
                                    placeholder="Package Name"
                                    value={pkg.name}
                                    onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Icon (emoji or image)"
                                    value={pkg.icon}
                                    onChange={(e) => handlePackageChange(index, 'icon', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={pkg.title}
                                    onChange={(e) => handlePackageChange(index, 'title', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={pkg.price}
                                    onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={pkg.description}
                                    onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Features (comma separated)"
                                    value={pkg.features?.join(',')}
                                    onChange={(e) => handlePackageChange(index, 'features', e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300"
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addPackage} className="text-sm text-blue-600 hover:underline">
                            + Add Package
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                    >
                        {editMode ? 'Update Service ✏️' : 'Create Service ➕'}
                    </button>
                </form>

                <div>
                    <h3 className="text-2xl font-semibold mb-6 text-gray-700">📋 All Services</h3>
                    {isLoading ? (
                        <p className="text-gray-600 text-center">Loading services...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services?.map((service: any) => (
                                <div key={service._id} className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow p-6 space-y-4">
                                    {service.photos?.length > 0 && (
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {service.photos.map((url: string | StaticImport, idx: React.Key | null | undefined) => (
                                                <div key={idx} className="relative w-24 h-24">
                                                    <Image
                                                        src={url}
                                                        alt={`Service Photo ${idx}`}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-lg border"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-2xl font-bold text-blue-700 mb-1">{service.title}</h4>
                                        <p className="text-gray-600 mb-2">{service.description}</p>
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <p><strong>ID:</strong> {service.slug || service.id}</p>
                                            <p><strong>Category:</strong> {service.category}</p>
                                            <p><strong>Base Price:</strong> ${service.basePrice}</p>
                                            <p><strong>Tags:</strong> <span className="text-gray-700">{service.tags?.join(', ')}</span></p>
                                            <p><strong>Input Fields:</strong> <span className="text-gray-700">{service.inputFields?.join(', ')}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <h5 className="font-semibold text-gray-700 mb-1">🔥 Popular Options</h5>
                                        <ul className="space-y-1 ml-4 list-disc">
                                            {service.popularOptions?.map((opt: any, idx: React.Key | null | undefined) => (
                                                <li key={idx}>
                                                    <p className="text-gray-800 font-medium">
                                                        {opt.name} <span className="text-gray-500">${opt.price}</span>{' '}
                                                        {opt.label && <span className="italic text-purple-500">({opt.label})</span>}
                                                    </p>
                                                    <p className="ml-2 text-gray-600">Details: {opt.details?.join(', ')}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <h5 className="font-semibold text-gray-700 mb-1">➕ Addons</h5>
                                        <ul className="space-y-1 ml-4 list-disc">
                                            {service.addons?.map((addon: any, idx: React.Key | null | undefined) => (
                                                <li key={idx}>
                                                    <span className="text-gray-800 font-medium">{addon.name}</span> - ${addon.price}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {service.packages?.length > 0 && (
                                        <div className="text-sm text-gray-600">
                                            <h5 className="font-semibold text-gray-700 mb-1">📦 Packages</h5>
                                            <ul className="space-y-2 ml-4">
                                                {service.packages.map((pkg: any, idx: number) => (
                                                    <li key={idx} className="border border-gray-200 p-3 rounded-xl">
                                                        <p className="text-lg font-bold text-purple-600">
                                                            {pkg.icon} {pkg.name} - ${pkg.price}
                                                        </p>
                                                        <p className="text-gray-700">{pkg.title}</p>
                                                        <p className="text-gray-500 text-sm mb-1">{pkg.description}</p>
                                                        <ul className="list-disc ml-5 text-gray-600 text-sm">
                                                            {pkg.features?.map((feat: string, fidx: number) => (
                                                                <li key={fidx}>{feat}</li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="relative">
                                        <label htmlFor={`delete-password-${service._id}`} className="block text-sm mb-1 text-gray-900">
                                            Password to Delete
                                        </label>
                                        <div className="relative">
                                            <input
                                                id={`delete-password-${service._id}`}
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                                                placeholder="Enter admin password"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="flex-1 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-medium transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
                                        >
                                            Delete
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