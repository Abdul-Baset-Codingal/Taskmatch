// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    Shield,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit3,
    Save,
    X,
    User,
    Briefcase,
    MessageSquare,
    Loader2,
    FileText,
    BadgeCheck,
    AlertTriangle,
    Clock,
    Camera,
    Plus,
    Trash2,
    Upload,
    DollarSign,
    MoreVertical,
    Copy,
    Ban,
    Eye,
    ChevronRight,
    ShieldCheck,
    GraduationCap,
    Wrench,
    ExternalLink,
    Hash,
    Activity,
    Zap,
    Globe,
    CreditCard,
    TrendingUp,
    ChevronDown,
} from 'lucide-react';
import {
    useApproveRejectTaskerMutation,
    useGetUserByIdQuery,
    useToggleTaskerProfileCheckMutation,
    useUpdateUserMutation,
    useBlockUserMutation,
} from '@/features/auth/authApi';
import { toast } from 'react-toastify';

// ==================== CONSTANTS ====================
const COUNTRIES = [
    { value: 'CA', label: 'Canada' },
    { value: 'US', label: 'United States' },
];

const PROVINCES = [
    { value: 'ON', label: 'Ontario' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'AB', label: 'Alberta' },
    { value: 'QC', label: 'Quebec' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland' },
    { value: 'PE', label: 'Prince Edward Island' },
];

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'zh', label: 'Chinese' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ar', label: 'Arabic' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'de', label: 'German' },
];

const CATEGORIES = [
    'Cleaning',
    'Moving',
    'Handyman',
    'Delivery',
    'Assembly',
    'Painting',
    'Gardening',
    'Plumbing',
    'Electrical',
    'Photography',
    'Personal Assistant',
    'Pet Care',
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PRICING_TYPES = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'fixed', label: 'Fixed' },
    { value: 'both', label: 'Both' },
];

const ID_TYPES = [
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'national_id', label: 'National ID' },
    { value: 'provincial_id', label: 'Provincial ID' },
];

const TASKER_STATUS_OPTIONS = [
    { value: 'not_applied', label: 'Not Applied' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

const STRIPE_STATUS_OPTIONS = [
    { value: 'not_connected', label: 'Not Connected' },
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'restricted', label: 'Restricted' },
];

// ==================== HELPERS ====================
const formatDate = (dateString: string): string => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount / 100);
};

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
};

// ==================== SUB COMPONENTS ====================

// Editable Input Component
const EditableField = ({
    label,
    value,
    isEditMode,
    onChange,
    type = 'text',
    placeholder = '',
    disabled = false,
    options = null,
    className = '',
}: {
    label: string;
    value: any;
    isEditMode: boolean;
    onChange: (value: any) => void;
    type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox';
    placeholder?: string;
    disabled?: boolean;
    options?: { value: string; label: string }[] | null;
    className?: string;
}) => {
    if (type === 'checkbox') {
        return (
            <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${className}`}>
                <span className="text-sm text-gray-700">{label}</span>
                {isEditMode ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value || false}
                            onChange={(e) => onChange(e.target.checked)}
                            disabled={disabled}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                ) : (
                    <span className={`flex items-center gap-1 text-sm font-medium ${value ? 'text-green-600' : 'text-gray-400'}`}>
                        {value ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {value ? 'Yes' : 'No'}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={className}>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
            {isEditMode ? (
                type === 'textarea' ? (
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                ) : type === 'select' && options ? (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Select...</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        value={value || ''}
                        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                )
            ) : (
                <p className="mt-1 text-sm font-medium text-gray-900">
                    {type === 'date' ? formatDate(value) : value || '—'}
                </p>
            )}
        </div>
    );
};

// Multi-Select Tags Component
const EditableTagsField = ({
    label,
    values,
    options,
    isEditMode,
    onChange,
    colorClass = 'bg-blue-50 text-blue-700',
}: {
    label: string;
    values: string[];
    options: string[];
    isEditMode: boolean;
    onChange: (values: string[]) => void;
    colorClass?: string;
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleValue = (value: string) => {
        if (values.includes(value)) {
            onChange(values.filter((v) => v !== value));
        } else {
            onChange([...values, value]);
        }
    };

    const removeValue = (value: string) => {
        onChange(values.filter((v) => v !== value));
    };

    return (
        <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">{label}</label>
            {isEditMode ? (
                <div className="relative">
                    <div
                        className="w-full min-h-[42px] px-3 py-2 border border-gray-200 rounded-lg cursor-pointer flex flex-wrap gap-2"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {values.length > 0 ? (
                            values.map((val) => (
                                <span
                                    key={val}
                                    className={`inline-flex items-center gap-1 px-2 py-1 ${colorClass} text-xs font-medium rounded-lg`}
                                >
                                    {val}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeValue(val);
                                        }}
                                        className="hover:opacity-70"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">Select {label.toLowerCase()}...</span>
                        )}
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-auto self-center" />
                    </div>
                    {showDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => toggleValue(option)}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${values.includes(option) ? 'bg-blue-50 text-blue-700' : ''
                                        }`}
                                >
                                    {option}
                                    {values.includes(option) && <CheckCircle className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {values?.length > 0 ? (
                        values.map((val, i) => (
                            <span key={i} className={`px-3 py-1.5 ${colorClass} text-sm font-medium rounded-lg`}>
                                {val}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-400">None</span>
                    )}
                </div>
            )}
        </div>
    );
};

// Availability Editor Component
const AvailabilityEditor = ({
    availability,
    isEditMode,
    onChange,
}: {
    availability: any[];
    isEditMode: boolean;
    onChange: (availability: any[]) => void;
}) => {
    const addSlot = () => {
        onChange([...availability, { day: 'Monday', from: '09:00', to: '17:00' }]);
    };

    const updateSlot = (index: number, field: string, value: string) => {
        const updated = [...availability];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeSlot = (index: number) => {
        onChange(availability.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Availability</label>
                {isEditMode && (
                    <button
                        onClick={addSlot}
                        className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        Add Slot
                    </button>
                )}
            </div>
            {availability?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availability.map((slot, i) => (
                        <div key={i} className="relative p-3 bg-gray-50 rounded-lg">
                            {isEditMode ? (
                                <>
                                    <button
                                        onClick={() => removeSlot(i)}
                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <select
                                        value={slot.day}
                                        onChange={(e) => updateSlot(i, 'day', e.target.value)}
                                        className="w-full text-xs mb-2 px-2 py-1 border border-gray-200 rounded"
                                    >
                                        {DAYS_OF_WEEK.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="flex gap-1">
                                        <input
                                            type="time"
                                            value={slot.from}
                                            onChange={(e) => updateSlot(i, 'from', e.target.value)}
                                            className="flex-1 text-xs px-1 py-1 border border-gray-200 rounded"
                                        />
                                        <input
                                            type="time"
                                            value={slot.to}
                                            onChange={(e) => updateSlot(i, 'to', e.target.value)}
                                            className="flex-1 text-xs px-1 py-1 border border-gray-200 rounded"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-900">{slot.day}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {slot.from} - {slot.to}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400">No availability set</p>
            )}
        </div>
    );
};

// Services Editor Component
const ServicesEditor = ({
    services,
    isEditMode,
    onChange,
}: {
    services: any[];
    isEditMode: boolean;
    onChange: (services: any[]) => void;
}) => {
    const addService = () => {
        onChange([
            ...services,
            {
                title: '',
                description: '',
                hourlyRate: 0,
                estimatedDuration: 1,
            },
        ]);
    };

    const updateService = (index: number, field: string, value: any) => {
        const updated = [...services];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeService = (index: number) => {
        onChange(services.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Services</h3>
                {isEditMode && (
                    <button
                        onClick={addService}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                    >
                        <Plus className="w-4 h-4" />
                        Add Service
                    </button>
                )}
            </div>
            {services?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, i) => (
                        <div key={i} className="p-4 border border-gray-200 rounded-xl relative">
                            {isEditMode && (
                                <button
                                    onClick={() => removeService(i)}
                                    className="absolute top-2 right-2 p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Wrench className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            value={service.title || service.name || ''}
                                            onChange={(e) => updateService(i, 'title', e.target.value)}
                                            placeholder="Service title"
                                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm font-semibold"
                                        />
                                    ) : (
                                        <h4 className="font-semibold text-gray-900">{service.title || service.name}</h4>
                                    )}
                                </div>
                            </div>
                            {isEditMode ? (
                                <textarea
                                    value={service.description || ''}
                                    onChange={(e) => updateService(i, 'description', e.target.value)}
                                    placeholder="Description"
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm mb-3 min-h-[60px]"
                                />
                            ) : (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                {isEditMode ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={service.hourlyRate || service.price || 0}
                                            onChange={(e) => updateService(i, 'hourlyRate', Number(e.target.value))}
                                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                                        />
                                        <span className="text-gray-500">/hr</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                                        <DollarSign className="w-4 h-4" />
                                        {service.hourlyRate || service.price}/hr
                                    </span>
                                )}
                                {isEditMode ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={service.estimatedDuration || 1}
                                            onChange={(e) => updateService(i, 'estimatedDuration', Number(e.target.value))}
                                            className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
                                        />
                                        <span className="text-gray-500 text-sm">h est.</span>
                                    </div>
                                ) : (
                                    service.estimatedDuration && (
                                        <span className="text-sm text-gray-400">{service.estimatedDuration}h est.</span>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No services added</p>
                </div>
            )}
        </div>
    );
};

// Qualifications Editor Component
const QualificationsEditor = ({
    qualifications,
    isEditMode,
    onChange,
}: {
    qualifications: any[];
    isEditMode: boolean;
    onChange: (qualifications: any[]) => void;
}) => {
    const [newQual, setNewQual] = useState('');

    const addQualification = () => {
        if (newQual.trim()) {
            onChange([...qualifications, { name: newQual.trim() }]);
            setNewQual('');
        }
    };

    const removeQualification = (index: number) => {
        onChange(qualifications.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Qualifications</label>
            {isEditMode && (
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newQual}
                        onChange={(e) => setNewQual(e.target.value)}
                        placeholder="Add qualification..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && addQualification()}
                    />
                    <button
                        onClick={addQualification}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            )}
            {qualifications?.length > 0 ? (
                <div className="space-y-2">
                    {qualifications.map((qual, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-900">{qual.name || qual}</span>
                            {isEditMode && (
                                <button
                                    onClick={() => removeQualification(i)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400">No qualifications added</p>
            )}
        </div>
    );
};

// Document Upload Component
const DocumentUpload = ({
    label,
    currentUrl,
    isEditMode,
    onFileChange,
    onView,
}: {
    label: string;
    currentUrl?: string;
    isEditMode: boolean;
    onFileChange: (file: File) => void;
    onView?: () => void;
}) => {
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onFileChange(e.target.files[0]);
        }
    };

    return (
        <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">{label}</label>
            <div className="aspect-[4/3] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden relative group">
                {currentUrl ? (
                    <>
                        <Image src={currentUrl} alt={label} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <a
                                href={currentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                            >
                                <Eye className="w-4 h-4" />
                            </a>
                            {isEditMode && (
                                <label className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                                    <Upload className="w-4 h-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                                </label>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {isEditMode ? (
                            <label className="cursor-pointer text-center">
                                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Click to upload</p>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                            </label>
                        ) : (
                            <>
                                <FileText className="w-8 h-8 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-400">No document</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
export default function UserDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    // API
    const { data: userData, isLoading, isError, refetch } = useGetUserByIdQuery(userId);
    const [toggleTaskerProfileCheck] = useToggleTaskerProfileCheckMutation();
    const [approveRejectTasker, { isLoading: isProcessing }] = useApproveRejectTaskerMutation();
    const [updateUser] = useUpdateUserMutation();
    const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();

    // State
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedData, setEditedData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [tempFiles, setTempFiles] = useState<Record<string, File>>({});
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [activeSection, setActiveSection] = useState('details');

    const user = userData?.user || userData;
    const isTasker = user?.roles?.includes('tasker') || false;
    const currentData = isEditMode ? editedData || user : user;

    useEffect(() => {
        if (user && isEditMode && !editedData) {
            // Deep clone the user object for editing
            setEditedData(JSON.parse(JSON.stringify(user)));
        }
    }, [user, isEditMode, editedData]);

    // Handlers
    const handleInputChange = (field: string, value: any) => {
        setEditedData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleNestedInputChange = (parent: string, field: string, value: any) => {
        setEditedData((prev: any) => ({
            ...prev,
            [parent]: { ...prev?.[parent], [field]: value },
        }));
    };

    const handleDeepNestedInputChange = (parent: string, child: string, field: string, value: any) => {
        setEditedData((prev: any) => ({
            ...prev,
            [parent]: {
                ...prev?.[parent],
                [child]: { ...prev?.[parent]?.[child], [field]: value },
            },
        }));
    };

    const handleArrayInputChange = (field: string, value: any[]) => {
        setEditedData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field: string, file: File) => {
        setTempFiles((prev) => ({ ...prev, [field]: file }));
        // For preview purposes
        setEditedData((prev: any) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    };

    const handleNestedFileChange = (parent: string, field: string, file: File) => {
        setTempFiles((prev) => ({ ...prev, [`${parent}.${field}`]: file }));
        setEditedData((prev: any) => ({
            ...prev,
            [parent]: { ...prev?.[parent], [field]: URL.createObjectURL(file) },
        }));
    };

    const handleSave = async () => {
        if (!editedData || !user?._id) return;
        setIsSaving(true);
        try {
            // Create FormData if there are files to upload
            const dataToSend = { ...editedData };

            // TODO: Handle file uploads separately if needed
            // For now, we send the data as JSON
            await updateUser({ userId: user._id, ...dataToSend }).unwrap();
            toast.success('Changes saved successfully!');
            setIsEditMode(false);
            setEditedData(null);
            setTempFiles({});
            refetch();
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error?.data?.message || 'Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setEditedData(null);
        setTempFiles({});
    };

    const handleApprove = async () => {
        try {
            await approveRejectTasker({ userId: user._id, action: 'approve' }).unwrap();
            toast.success('Tasker approved successfully!');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to approve tasker');
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        try {
            await approveRejectTasker({ userId: user._id, action: 'reject', reason: rejectReason }).unwrap();
            toast.success('Tasker application rejected');
            setShowRejectModal(false);
            setRejectReason('');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to reject tasker');
        }
    };

    const handleToggleBlock = async () => {
        try {
            await blockUser({ id: user._id, block: !user.isBlocked }).unwrap();
            toast.success(user.isBlocked ? 'User unblocked' : 'User blocked');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update user status');
        }
    };

    // Loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Error
    if (isError || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">User Not Found</h2>
                    <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-700';
            case 'under_review':
                return 'bg-yellow-100 text-yellow-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
                <div className="flex items-center justify-between max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-gray-200" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h1>
                                {user.taskerProfileCheck && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                                {isEditMode && (
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                                        Editing
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>ID: {user._id?.slice(-8)}</span>
                                <button onClick={() => copyToClipboard(user._id)} className="hover:text-gray-700">
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isEditMode ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditedData(JSON.parse(JSON.stringify(user)));
                                    setIsEditMode(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit User
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="h-20 bg-gradient-to-r from-gray-800 to-gray-900" />
                            <div className="px-5 pb-5 -mt-10">
                                <div className="relative inline-block">
                                    {currentData?.profilePicture ? (
                                        <Image
                                            src={currentData.profilePicture}
                                            alt="Profile"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 rounded-xl border-4 border-white object-cover shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl border-4 border-white bg-gray-100 flex items-center justify-center shadow-sm">
                                            <User className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    {isEditMode && (
                                        <label className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                                            <Camera className="w-3.5 h-3.5" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    e.target.files?.[0] && handleFileChange('profilePicture', e.target.files[0])
                                                }
                                            />
                                        </label>
                                    )}
                                </div>

                                <h2 className="text-lg font-semibold text-gray-900 mt-3">
                                    {currentData?.firstName} {currentData?.lastName}
                                </h2>

                                {/* Current Role - Editable */}
                                {isEditMode ? (
                                    <select
                                        value={editedData?.currentRole || 'client'}
                                        onChange={(e) => handleInputChange('currentRole', e.target.value)}
                                        className="mt-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                    >
                                        <option value="client">Client</option>
                                        <option value="tasker">Tasker</option>
                                    </select>
                                ) : (
                                    <p className="text-sm text-gray-500 capitalize">{currentData?.currentRole || 'User'}</p>
                                )}

                                {/* Roles - Editable */}
                                {isEditMode && (
                                    <div className="mt-3">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Roles</label>
                                        <div className="flex gap-2 mt-1">
                                            {['client', 'tasker'].map((role) => (
                                                <label key={role} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={editedData?.roles?.includes(role)}
                                                        onChange={(e) => {
                                                            const roles = editedData?.roles || [];
                                                            if (e.target.checked) {
                                                                handleInputChange('roles', [...roles, role]);
                                                            } else {
                                                                handleInputChange(
                                                                    'roles',
                                                                    roles.filter((r: string) => r !== role)
                                                                );
                                                            }
                                                        }}
                                                        className="rounded border-gray-300"
                                                    />
                                                    <span className="text-sm capitalize">{role}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {isEditMode ? (
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={editedData?.isBlocked || false}
                                                onChange={(e) => handleInputChange('isBlocked', e.target.checked)}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">Blocked</span>
                                        </label>
                                    ) : (
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                }`}
                                        >
                                            {user.isBlocked ? <Ban className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    )}

                                    {isTasker && (
                                        isEditMode ? (
                                            <select
                                                value={editedData?.taskerStatus || 'not_applied'}
                                                onChange={(e) => handleInputChange('taskerStatus', e.target.value)}
                                                className="px-2 py-1 border border-gray-200 rounded text-xs"
                                            >
                                                {TASKER_STATUS_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    user.taskerStatus
                                                )}`}
                                            >
                                                {user.taskerStatus === 'approved' && <CheckCircle className="w-3 h-3" />}
                                                {user.taskerStatus === 'under_review' && <Clock className="w-3 h-3" />}
                                                {user.taskerStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                                                {user.taskerStatus?.replace('_', ' ') || 'Not Applied'}
                                            </span>
                                        )
                                    )}
                                </div>

                                {/* Contact Info */}
                                <div className="mt-5 space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {isEditMode ? (
                                            <input
                                                type="email"
                                                value={editedData?.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                            />
                                        ) : (
                                            <span className="text-gray-600 truncate">{currentData?.email || '—'}</span>
                                        )}
                                        {currentData?.isEmailVerified && !isEditMode && (
                                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {isEditMode ? (
                                            <input
                                                type="tel"
                                                value={editedData?.phone || ''}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                            />
                                        ) : (
                                            <span className="text-gray-600">{currentData?.phone || '—'}</span>
                                        )}
                                        {currentData?.isPhoneVerified && !isEditMode && (
                                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        {isEditMode ? (
                                            <select
                                                value={editedData?.address?.country || ''}
                                                onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                            >
                                                <option value="">Select country</option>
                                                {COUNTRIES.map((c) => (
                                                    <option key={c.value} value={c.value}>
                                                        {c.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-gray-600">{currentData?.address?.country || '—'}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Joined {formatDate(currentData?.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Rating - Editable for admin */}
                                {isTasker && (
                                    <div className="mt-5 pt-5 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Rating</span>
                                            {isEditMode ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="5"
                                                        step="0.1"
                                                        value={editedData?.rating || 0}
                                                        onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                                                        className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
                                                    />
                                                    <span className="text-gray-400">/</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={editedData?.reviewCount || 0}
                                                        onChange={(e) => handleInputChange('reviewCount', parseInt(e.target.value))}
                                                        className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
                                                        placeholder="reviews"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="font-semibold text-gray-900">
                                                        {currentData?.rating?.toFixed(1) || '0.0'}
                                                    </span>
                                                    <span className="text-gray-400 text-sm">({currentData?.reviewCount || 0})</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Card (for Taskers) - Editable */}
                        {isTasker && (
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Stats</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        {isEditMode ? (
                                            <input
                                                type="number"
                                                value={editedData?.stats?.tasksCompleted || 0}
                                                onChange={(e) =>
                                                    handleNestedInputChange('stats', 'tasksCompleted', parseInt(e.target.value))
                                                }
                                                className="w-full text-xl font-bold text-blue-600 bg-transparent border-b border-blue-300 focus:outline-none"
                                            />
                                        ) : (
                                            <p className="text-2xl font-bold text-blue-600">
                                                {currentData?.stats?.tasksCompleted || 0}
                                            </p>
                                        )}
                                        <p className="text-xs text-blue-600/70">Tasks Done</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        {isEditMode ? (
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={editedData?.stats?.completionRate || 0}
                                                onChange={(e) =>
                                                    handleNestedInputChange('stats', 'completionRate', parseInt(e.target.value))
                                                }
                                                className="w-full text-xl font-bold text-green-600 bg-transparent border-b border-green-300 focus:outline-none"
                                            />
                                        ) : (
                                            <p className="text-2xl font-bold text-green-600">
                                                {currentData?.stats?.completionRate || 0}%
                                            </p>
                                        )}
                                        <p className="text-xs text-green-600/70">Completion</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        {isEditMode ? (
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={editedData?.stats?.responseRate || 0}
                                                onChange={(e) =>
                                                    handleNestedInputChange('stats', 'responseRate', parseInt(e.target.value))
                                                }
                                                className="w-full text-xl font-bold text-purple-600 bg-transparent border-b border-purple-300 focus:outline-none"
                                            />
                                        ) : (
                                            <p className="text-2xl font-bold text-purple-600">
                                                {currentData?.stats?.responseRate || 0}%
                                            </p>
                                        )}
                                        <p className="text-xs text-purple-600/70">Response</p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-lg">
                                        {isEditMode ? (
                                            <div className="flex items-center">
                                                <span className="text-orange-600 mr-1">$</span>
                                                <input
                                                    type="number"
                                                    value={(editedData?.stats?.totalEarnings || 0) / 100}
                                                    onChange={(e) =>
                                                        handleNestedInputChange('stats', 'totalEarnings', parseFloat(e.target.value) * 100)
                                                    }
                                                    className="w-full text-xl font-bold text-orange-600 bg-transparent border-b border-orange-300 focus:outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-2xl font-bold text-orange-600">
                                                ${((currentData?.stats?.totalEarnings || 0) / 100).toFixed(0)}
                                            </p>
                                        )}
                                        <p className="text-xs text-orange-600/70">Earnings</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Mail className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Send Email</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <ExternalLink className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">View Profile</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                    onClick={handleToggleBlock}
                                    disabled={isBlocking}
                                    className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <Ban className="w-4 h-4 text-red-600" />
                                        </div>
                                        <span className="text-sm font-medium text-red-600">
                                            {isBlocking ? 'Processing...' : user.isBlocked ? 'Unblock User' : 'Block User'}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        </div>

                        {/* Tasker Approval Card */}
                        {isTasker && (user.taskerStatus === 'under_review' || user.taskerStatus === 'not_applied') && !isEditMode && (
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Pending Review</h3>
                                        <p className="text-sm text-white/70">Tasker application</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={handleApprove}
                                        disabled={isProcessing}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4" />
                                        )}
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 rounded-lg font-medium hover:bg-white/30"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                        {/* Navigation */}
                        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1.5 overflow-x-auto">
                            {[
                                { id: 'details', label: 'Details', icon: User },
                                { id: 'documents', label: 'Documents', icon: FileText },
                                ...(isTasker
                                    ? [
                                        { id: 'services', label: 'Services', icon: Briefcase },
                                        { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                                        { id: 'payments', label: 'Payments', icon: CreditCard },
                                    ]
                                    : []),
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeSection === item.id
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Details Section */}
                        {activeSection === 'details' && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {/* Personal Info */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">Personal Information</h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <EditableField
                                                label="First Name"
                                                value={currentData?.firstName}
                                                isEditMode={isEditMode}
                                                onChange={(v) => handleInputChange('firstName', v)}
                                            />
                                            <EditableField
                                                label="Last Name"
                                                value={currentData?.lastName}
                                                isEditMode={isEditMode}
                                                onChange={(v) => handleInputChange('lastName', v)}
                                            />
                                        </div>
                                        <EditableField
                                            label="Email"
                                            value={currentData?.email}
                                            isEditMode={isEditMode}
                                            type="email"
                                            onChange={(v) => handleInputChange('email', v)}
                                        />
                                        <EditableField
                                            label="Phone"
                                            value={currentData?.phone}
                                            isEditMode={isEditMode}
                                            type="tel"
                                            onChange={(v) => handleInputChange('phone', v)}
                                        />
                                        <EditableField
                                            label="Date of Birth"
                                            value={isEditMode ? formatDateForInput(currentData?.dob) : currentData?.dob}
                                            isEditMode={isEditMode}
                                            type="date"
                                            onChange={(v) => handleInputChange('dob', v)}
                                        />
                                        <EditableField
                                            label="Language"
                                            value={currentData?.language}
                                            isEditMode={isEditMode}
                                            type="select"
                                            options={LANGUAGES}
                                            onChange={(v) => handleInputChange('language', v)}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">Address</h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <EditableField
                                            label="Street Address"
                                            value={currentData?.address?.street}
                                            isEditMode={isEditMode}
                                            onChange={(v) => handleNestedInputChange('address', 'street', v)}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <EditableField
                                                label="City"
                                                value={currentData?.address?.city}
                                                isEditMode={isEditMode}
                                                onChange={(v) => handleNestedInputChange('address', 'city', v)}
                                            />
                                            <EditableField
                                                label="Province"
                                                value={currentData?.address?.province}
                                                isEditMode={isEditMode}
                                                type="select"
                                                options={PROVINCES}
                                                onChange={(v) => handleNestedInputChange('address', 'province', v)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <EditableField
                                                label="Postal Code"
                                                value={currentData?.address?.postalCode}
                                                isEditMode={isEditMode}
                                                onChange={(v) => handleNestedInputChange('address', 'postalCode', v)}
                                            />
                                            <EditableField
                                                label="Country"
                                                value={currentData?.address?.country}
                                                isEditMode={isEditMode}
                                                type="select"
                                                options={COUNTRIES}
                                                onChange={(v) => handleNestedInputChange('address', 'country', v)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Status */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">Verification Status</h3>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <EditableField
                                            label="Email Verified"
                                            value={currentData?.isEmailVerified}
                                            isEditMode={isEditMode}
                                            type="checkbox"
                                            onChange={(v) => handleInputChange('isEmailVerified', v)}
                                        />
                                        <EditableField
                                            label="Phone Verified"
                                            value={currentData?.isPhoneVerified}
                                            isEditMode={isEditMode}
                                            type="checkbox"
                                            onChange={(v) => handleInputChange('isPhoneVerified', v)}
                                        />
                                        <EditableField
                                            label="ID Verified"
                                            value={currentData?.idVerification?.verified}
                                            isEditMode={isEditMode}
                                            type="checkbox"
                                            onChange={(v) => handleNestedInputChange('idVerification', 'verified', v)}
                                        />
                                        <EditableField
                                            label="Has Insurance"
                                            value={currentData?.insurance?.hasInsurance}
                                            isEditMode={isEditMode}
                                            type="checkbox"
                                            onChange={(v) => handleNestedInputChange('insurance', 'hasInsurance', v)}
                                        />
                                        <EditableField
                                            label="Insurance Verified"
                                            value={currentData?.insurance?.verified}
                                            isEditMode={isEditMode}
                                            type="checkbox"
                                            onChange={(v) => handleNestedInputChange('insurance', 'verified', v)}
                                        />
                                        <EditableField
                                            label="Background Check Consented"
                                            value={currentData?.backgroundCheck?.consented}
                                            isEditMode={isEditMode}
                                            type="checkbox"
                                            onChange={(v) => handleNestedInputChange('backgroundCheck', 'consented', v)}
                                        />
                                        <EditableField
                                            label="Background Check Completed"
                                            value={currentData?.backgroundCheck?.completed}
                                            isEditMode={isEditMode}
                                            type="checkbox"
                                            onChange={(v) => handleNestedInputChange('backgroundCheck', 'completed', v)}
                                        />
                                        <EditableField
                                            label="Tasker Profile Verified"
                                            value={currentData?.taskerProfileCheck}
                                            isEditMode={isEditMode}
                                            type="checkbox"
                                            onChange={(v) => handleInputChange('taskerProfileCheck', v)}
                                        />
                                    </div>
                                </div>

                                {/* About Section */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">About</h3>
                                    </div>
                                    <div className="p-5">
                                        <EditableField
                                            label=""
                                            value={currentData?.about}
                                            isEditMode={isEditMode}
                                            type="textarea"
                                            placeholder="User bio..."
                                            onChange={(v) => handleInputChange('about', v)}
                                        />
                                    </div>
                                </div>

                                {/* Professional Details (for Taskers) */}
                                {isTasker && (
                                    <>
                                        {/* Tasker Info */}
                                        <div className="bg-white rounded-xl border border-gray-200">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <h3 className="font-semibold text-gray-900">Tasker Details</h3>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <EditableField
                                                        label="Years of Experience"
                                                        value={currentData?.yearsOfExperience}
                                                        isEditMode={isEditMode}
                                                        type="number"
                                                        onChange={(v) => handleInputChange('yearsOfExperience', v)}
                                                    />
                                                    <EditableField
                                                        label="Travel Distance (km)"
                                                        value={currentData?.travelDistance}
                                                        isEditMode={isEditMode}
                                                        type="number"
                                                        onChange={(v) => handleInputChange('travelDistance', v)}
                                                    />
                                                    <EditableField
                                                        label="Advance Notice (hours)"
                                                        value={currentData?.advanceNotice}
                                                        isEditMode={isEditMode}
                                                        type="number"
                                                        onChange={(v) => handleInputChange('advanceNotice', v)}
                                                    />
                                                    <EditableField
                                                        label="Pricing Type"
                                                        value={currentData?.pricingType}
                                                        isEditMode={isEditMode}
                                                        type="select"
                                                        options={PRICING_TYPES}
                                                        onChange={(v) => handleInputChange('pricingType', v)}
                                                    />
                                                </div>
                                                <EditableField
                                                    label="Charges GST"
                                                    value={currentData?.chargesGST}
                                                    isEditMode={isEditMode}
                                                    type="checkbox"
                                                    onChange={(v) => handleInputChange('chargesGST', v)}
                                                />
                                                <EditableField
                                                    label="Profile Complete"
                                                    value={currentData?.taskerProfileComplete}
                                                    isEditMode={isEditMode}
                                                    type="checkbox"
                                                    onChange={(v) => handleInputChange('taskerProfileComplete', v)}
                                                />
                                            </div>
                                        </div>

                                        {/* Service Areas */}
                                        <div className="bg-white rounded-xl border border-gray-200">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <h3 className="font-semibold text-gray-900">Service Areas</h3>
                                            </div>
                                            <div className="p-5">
                                                <EditableTagsField
                                                    label=""
                                                    values={currentData?.serviceAreas || []}
                                                    options={PROVINCES.map((p) => p.label)}
                                                    isEditMode={isEditMode}
                                                    onChange={(v) => handleInputChange('serviceAreas', v)}
                                                    colorClass="bg-purple-50 text-purple-700"
                                                />
                                            </div>
                                        </div>

                                        {/* Categories */}
                                        <div className="bg-white rounded-xl border border-gray-200">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <h3 className="font-semibold text-gray-900">Categories</h3>
                                            </div>
                                            <div className="p-5">
                                                <EditableTagsField
                                                    label=""
                                                    values={currentData?.categories || []}
                                                    options={CATEGORIES}
                                                    isEditMode={isEditMode}
                                                    onChange={(v) => handleInputChange('categories', v)}
                                                    colorClass="bg-blue-50 text-blue-700"
                                                />
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="bg-white rounded-xl border border-gray-200">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <h3 className="font-semibold text-gray-900">Skills</h3>
                                            </div>
                                            <div className="p-5">
                                                <EditableTagsField
                                                    label=""
                                                    values={currentData?.skills || []}
                                                    options={[
                                                        'Communication',
                                                        'Time Management',
                                                        'Problem Solving',
                                                        'Customer Service',
                                                        'Technical Skills',
                                                        'Physical Fitness',
                                                        'Attention to Detail',
                                                        'Reliability',
                                                    ]}
                                                    isEditMode={isEditMode}
                                                    onChange={(v) => handleInputChange('skills', v)}
                                                    colorClass="bg-green-50 text-green-700"
                                                />
                                            </div>
                                        </div>

                                        {/* Availability */}
                                        <div className="bg-white rounded-xl border border-gray-200 xl:col-span-2">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <h3 className="font-semibold text-gray-900">Availability</h3>
                                            </div>
                                            <div className="p-5">
                                                <AvailabilityEditor
                                                    availability={currentData?.availability || []}
                                                    isEditMode={isEditMode}
                                                    onChange={(v) => handleInputChange('availability', v)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Documents Section */}
                        {activeSection === 'documents' && (
                            <div className="space-y-6">
                                {/* ID Verification */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">Identity Documents</h3>
                                        {isEditMode ? (
                                            <select
                                                value={editedData?.idVerification?.verified ? 'verified' : 'pending'}
                                                onChange={(e) =>
                                                    handleNestedInputChange('idVerification', 'verified', e.target.value === 'verified')
                                                }
                                                className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="verified">Verified</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${currentData?.idVerification?.verified
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {currentData?.idVerification?.verified ? 'Verified' : 'Pending'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        {/* ID Type */}
                                        <div className="mb-4">
                                            <EditableField
                                                label="ID Type"
                                                value={currentData?.idVerification?.type}
                                                isEditMode={isEditMode}
                                                type="select"
                                                options={ID_TYPES}
                                                onChange={(v) => handleNestedInputChange('idVerification', 'type', v)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <DocumentUpload
                                                label="Document Front"
                                                currentUrl={currentData?.idVerification?.documentFront}
                                                isEditMode={isEditMode}
                                                onFileChange={(file) => handleNestedFileChange('idVerification', 'documentFront', file)}
                                            />
                                            <DocumentUpload
                                                label="Document Back"
                                                currentUrl={currentData?.idVerification?.documentBack}
                                                isEditMode={isEditMode}
                                                onFileChange={(file) => handleNestedFileChange('idVerification', 'documentBack', file)}
                                            />
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <EditableField
                                                label="Issue Date"
                                                value={
                                                    isEditMode
                                                        ? formatDateForInput(currentData?.idVerification?.issueDate)
                                                        : currentData?.idVerification?.issueDate
                                                }
                                                isEditMode={isEditMode}
                                                type="date"
                                                onChange={(v) => handleNestedInputChange('idVerification', 'issueDate', v)}
                                            />
                                            <EditableField
                                                label="Expiry Date"
                                                value={
                                                    isEditMode
                                                        ? formatDateForInput(currentData?.idVerification?.expiryDate)
                                                        : currentData?.idVerification?.expiryDate
                                                }
                                                isEditMode={isEditMode}
                                                type="date"
                                                onChange={(v) => handleNestedInputChange('idVerification', 'expiryDate', v)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Insurance */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">Insurance</h3>
                                        {isEditMode ? (
                                            <select
                                                value={
                                                    editedData?.insurance?.verified
                                                        ? 'verified'
                                                        : editedData?.insurance?.hasInsurance
                                                            ? 'pending'
                                                            : 'none'
                                                }
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleNestedInputChange('insurance', 'verified', val === 'verified');
                                                    handleNestedInputChange('insurance', 'hasInsurance', val !== 'none');
                                                }}
                                                className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                                            >
                                                <option value="none">Not Provided</option>
                                                <option value="pending">Pending</option>
                                                <option value="verified">Verified</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${currentData?.insurance?.verified
                                                        ? 'bg-green-100 text-green-700'
                                                        : currentData?.insurance?.hasInsurance
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {currentData?.insurance?.verified
                                                    ? 'Verified'
                                                    : currentData?.insurance?.hasInsurance
                                                        ? 'Pending'
                                                        : 'Not Provided'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="max-w-md">
                                            <DocumentUpload
                                                label="Insurance Document"
                                                currentUrl={currentData?.insurance?.documentUrl}
                                                isEditMode={isEditMode}
                                                onFileChange={(file) => handleNestedFileChange('insurance', 'documentUrl', file)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Qualifications */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">Qualifications</h3>
                                    </div>
                                    <div className="p-5">
                                        <QualificationsEditor
                                            qualifications={currentData?.qualifications || []}
                                            isEditMode={isEditMode}
                                            onChange={(v) => handleInputChange('qualifications', v)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Services Section */}
                        {activeSection === 'services' && isTasker && (
                            <div className="bg-white rounded-xl border border-gray-200">
                                <div className="p-5">
                                    <ServicesEditor
                                        services={currentData?.services || []}
                                        isEditMode={isEditMode}
                                        onChange={(v) => handleInputChange('services', v)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Reviews Section - Display only (reviews typically shouldn't be edited by admin) */}
                        {activeSection === 'reviews' && isTasker && (
                            <div className="space-y-6">
                                {/* Rating Summary */}
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900">
                                                {currentData?.rating?.toFixed(1) || '0.0'}
                                            </div>
                                            <div className="flex items-center gap-0.5 mt-1 justify-center">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-4 h-4 ${s <= Math.round(currentData?.rating || 0)
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{currentData?.reviewCount || 0} reviews</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">All Reviews</h3>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {currentData?.reviews?.length > 0 ? (
                                            currentData.reviews.map((review: any, i: number) => (
                                                <div key={i} className="p-5">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <User className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {review.userName || review.clientName || 'Anonymous'}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    className={`w-3.5 h-3.5 ${s <= review.rating
                                                                            ? 'text-yellow-400 fill-yellow-400'
                                                                            : 'text-gray-200'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {review.message || review.comment || review.text}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">No reviews yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payments Section */}
                        {activeSection === 'payments' && isTasker && (
                            <div className="space-y-6">
                                {/* Stripe Connect Status */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">Stripe Connect</h3>
                                        {isEditMode ? (
                                            <select
                                                value={editedData?.stripeConnectStatus || 'not_connected'}
                                                onChange={(e) => handleInputChange('stripeConnectStatus', e.target.value)}
                                                className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                                            >
                                                {STRIPE_STATUS_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${currentData?.stripeConnectStatus === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {currentData?.stripeConnectStatus || 'Not Connected'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <EditableField
                                                label="Account ID"
                                                value={currentData?.stripeConnectAccountId}
                                                isEditMode={isEditMode}
                                                onChange={(v) => handleInputChange('stripeConnectAccountId', v)}
                                            />
                                            <EditableField
                                                label="Connected At"
                                                value={
                                                    isEditMode
                                                        ? formatDateForInput(currentData?.stripeConnectCreatedAt)
                                                        : currentData?.stripeConnectCreatedAt
                                                }
                                                isEditMode={isEditMode}
                                                type="date"
                                                onChange={(v) => handleInputChange('stripeConnectCreatedAt', v)}
                                            />
                                        </div>

                                        {/* Stripe Details - Editable */}
                                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                                            <EditableField
                                                label="Charges Enabled"
                                                value={currentData?.stripeConnectDetails?.chargesEnabled}
                                                isEditMode={isEditMode}
                                                type="checkbox"
                                                onChange={(v) =>
                                                    handleNestedInputChange('stripeConnectDetails', 'chargesEnabled', v)
                                                }
                                            />
                                            <EditableField
                                                label="Payouts Enabled"
                                                value={currentData?.stripeConnectDetails?.payoutsEnabled}
                                                isEditMode={isEditMode}
                                                type="checkbox"
                                                onChange={(v) =>
                                                    handleNestedInputChange('stripeConnectDetails', 'payoutsEnabled', v)
                                                }
                                            />
                                            <EditableField
                                                label="Details Submitted"
                                                value={currentData?.stripeConnectDetails?.detailsSubmitted}
                                                isEditMode={isEditMode}
                                                type="checkbox"
                                                onChange={(v) =>
                                                    handleNestedInputChange('stripeConnectDetails', 'detailsSubmitted', v)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Earnings Summary */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">Earnings Summary</h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                                                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                                                    Total Earnings
                                                </p>
                                                {isEditMode ? (
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-green-700 mr-1">$</span>
                                                        <input
                                                            type="number"
                                                            value={(editedData?.stats?.totalEarnings || 0) / 100}
                                                            onChange={(e) =>
                                                                handleNestedInputChange(
                                                                    'stats',
                                                                    'totalEarnings',
                                                                    parseFloat(e.target.value) * 100
                                                                )
                                                            }
                                                            className="text-xl font-bold text-green-700 bg-transparent border-b border-green-300 w-full focus:outline-none"
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className="text-2xl font-bold text-green-700 mt-1">
                                                        ${((currentData?.stats?.totalEarnings || 0) / 100).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                                                    Tasks Completed
                                                </p>
                                                {isEditMode ? (
                                                    <input
                                                        type="number"
                                                        value={editedData?.stats?.tasksCompleted || 0}
                                                        onChange={(e) =>
                                                            handleNestedInputChange('stats', 'tasksCompleted', parseInt(e.target.value))
                                                        }
                                                        className="text-2xl font-bold text-blue-700 bg-transparent border-b border-blue-300 w-full mt-1 focus:outline-none"
                                                    />
                                                ) : (
                                                    <p className="text-2xl font-bold text-blue-700 mt-1">
                                                        {currentData?.stats?.tasksCompleted || 0}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                                                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Bookings</p>
                                                {isEditMode ? (
                                                    <input
                                                        type="number"
                                                        value={editedData?.stats?.bookingsCompleted || 0}
                                                        onChange={(e) =>
                                                            handleNestedInputChange(
                                                                'stats',
                                                                'bookingsCompleted',
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        className="text-2xl font-bold text-purple-700 bg-transparent border-b border-purple-300 w-full mt-1 focus:outline-none"
                                                    />
                                                ) : (
                                                    <p className="text-2xl font-bold text-purple-700 mt-1">
                                                        {currentData?.stats?.bookingsCompleted || 0}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                                                <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                                                    Avg Per Task
                                                </p>
                                                <p className="text-2xl font-bold text-orange-700 mt-1">
                                                    $
                                                    {currentData?.stats?.tasksCompleted > 0
                                                        ? (
                                                            (currentData?.stats?.totalEarnings || 0) /
                                                            100 /
                                                            currentData.stats.tasksCompleted
                                                        ).toFixed(0)
                                                        : 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowRejectModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Application</h3>
                        <p className="text-sm text-gray-500 mb-4">Provide a reason for rejecting this tasker application.</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}